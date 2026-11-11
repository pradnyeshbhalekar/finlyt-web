// Tiny rule-based stand-in for the AI step, so the website demo works offline.
// The real app sends the text to the AI; this just handles the common phrasings.

const CATEGORIES = [
  ['Groceries', ['grocer', 'sabzi', 'vegetable', 'veggies', 'fruit', 'milk', 'kirana', 'dmart', 'blinkit', 'zepto', 'bigbasket']],
  ['Food', ['lunch', 'dinner', 'breakfast', 'chai', 'tea', 'coffee', 'snack', 'food', 'pizza', 'burger', 'biryani', 'cafe', 'juice', 'samosa', 'momo', 'maggi', 'zomato', 'swiggy']],
  ['Transport', ['auto', 'cab', 'uber', 'ola', 'rapido', 'metro', 'bus', 'train', 'petrol', 'fuel', 'parking', 'toll', 'ride']],
  ['Shopping', ['shop', 'clothes', 'shirt', 'shoe', 'amazon', 'flipkart', 'myntra', 'gift']],
  ['Bills', ['bill', 'rent', 'electricity', 'recharge', 'wifi', 'internet', 'emi', 'subscription']],
  ['Health', ['medicine', 'pharmacy', 'doctor', 'chemist', 'gym', 'hospital']],
  ['Fun', ['movie', 'netflix', 'game', 'concert', 'party', 'drinks', 'beer']],
]

function categorise(text) {
  for (const [name, words] of CATEGORIES) {
    if (words.some((w) => new RegExp(`\\b${w}`).test(text))) return name
  }
  return 'Other'
}

// Quick log from the home-screen widget: "chai 40", "₹1,200 rent", "auto 85.50".
// Returns null when there's no amount to log.
export function parseQuickLog(input) {
  const match = input.match(/(?:₹|rs\.?\s*)?(\d[\d,]*(?:\.\d+)?)/i)
  if (!match) return null
  const amount = Math.min(Math.round(Number(match[1].replace(/,/g, ''))), 100000)
  if (!amount) return null
  return { amount, category: categorise(input.toLowerCase()) }
}

const CASH = /\b(cash|nakad)\b/
const PAY_WORDS = /\b(?:(?:in|by|via|using|paid)\s+)?(?:cash|nakad|upi|gpay|phonepe|paytm|card)\b/gi
const PRONOUNS = new Set(['he', 'she', 'they', 'usne', 'woh', 'wo'])

const title = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()

// "450", "₹1,200", "rs 85.5", "1.2k"
function amountIn(text) {
  const m = text.match(/(?:₹|rs\.?\s*)?(\d[\d,]*(?:\.\d+)?)(\s*k\b)?/i)
  if (!m) return null
  const value = Math.round(Number(m[1].replace(/,/g, '')) * (m[2] ? 1000 : 1))
  return value > 0 ? { value: Math.min(value, 100000), text: m[0] } : null
}

function describe(part, amountText) {
  const words = part
    .replace(amountText, ' ')
    .replace(PAY_WORDS, ' ')
    .replace(/\bhalf\b/gi, ' ')
    .replace(/\bwith\s+([a-z]+)/i, (_, name) => `with ${title(name)}`)
    .replace(/\s+/g, ' ')
    .trim()
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Something'
}

// What you'd type in the box on Home: one or more spends, cash or UPI, and what a friend owes.
// "chai 40 cash, auto 120" · "lunch 450 with Rahul, he owes 200" · "auto 120, paid 30 more in
// cash" · "dmart 1.2k groceries". Returns null when there's no amount in it. The real app sends
// the words to the AI; this covers the common ways of saying it so the demo works offline.
export function parseLog(input) {
  const parts = input.split(/,|\band\b|\baur\b|\n/i).map((p) => p.trim()).filter(Boolean)
  const entries = []
  for (const part of parts) {
    const lower = part.toLowerCase()
    const amount = amountIn(lower)
    const last = entries[entries.length - 1]
    // "he owes 200", "Rahul owes 200": their share of the spend before it.
    if (last && /\bowes?\b|\bdena hai\b/.test(lower)) {
      const who = lower.match(/^([a-z]+)\s+(?:owes?|ko)\b/)?.[1]
      if (who && !PRONOUNS.has(who)) last.person = title(who)
      last.person ??= 'A friend'
      last.owed = Math.min(amount ? amount.value : Math.round(last.total / 2), last.total)
      continue
    }
    // "paid 30 more in cash", "20 extra": added to the spend before it.
    if (last && amount && /\b(more|extra|plus|tip)\b/.test(lower)) {
      last.total += amount.value
      if (CASH.test(lower)) last.cash += amount.value
      else last.upi += amount.value
      continue
    }
    if (!amount) continue
    const cash = CASH.test(lower)
    const half = cash && /\bhalf\b/.test(lower)
    const cashPart = half ? Math.round(amount.value / 2) : cash ? amount.value : 0
    entries.push({
      description: describe(part, amount.text),
      category: categorise(lower),
      total: amount.value,
      cash: cashPart,
      upi: amount.value - cashPart,
      via: /\bcard\b/.test(lower) ? 'Card' : 'UPI', // how the non-cash part was paid
      person: lower.match(/\bwith\s+([a-z]+)/)?.[1] ? title(lower.match(/\bwith\s+([a-z]+)/)[1]) : null,
      owed: 0,
    })
  }
  return entries.length ? entries : null
}
