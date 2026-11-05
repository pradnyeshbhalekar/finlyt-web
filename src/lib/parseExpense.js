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

// The detected payment is the UPI part. Cash mentioned in the text is added on top.
function cashPart(text, upi) {
  if (/\bhalf\b.*\bcash\b|\bcash\b.*\bhalf\b/.test(text)) return upi
  // "200 cash", "200 more in cash", "30 tip in cash": a number up to three words before "cash"
  const before = text.match(/(\d+(?:\.\d+)?)\s*(?:[a-z.₹]+\s+){0,3}?cash/)
  if (before) return Math.round(Number(before[1]))
  const after = text.match(/cash\s*(?:of\s*)?(?:₹|rs\.?\s*)?(\d+(?:\.\d+)?)/)
  if (after) return Math.round(Number(after[1]))
  return 0
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

export function parseExpense(input, payment) {
  const text = input.toLowerCase()
  const cash = Math.min(cashPart(text, payment.amount), 100000)
  return {
    id: payment.id,
    merchant: payment.merchant,
    note: input.trim().replace(/^./, (c) => c.toUpperCase()),
    category: categorise(text),
    upi: payment.amount,
    cash,
    total: payment.amount + cash,
  }
}
