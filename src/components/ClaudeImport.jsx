import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import SectionHeading from './SectionHeading'

const PROMPT = `Go through this entire chat and list every expense I've mentioned.

Reply with ONLY a table, no other text, using these columns:
date | amount | description | category | paid_via

- date: YYYY-MM-DD
- amount: number in INR, no ₹ sign
- paid_via: UPI, Cash or Card (split payments = one row per part)`

const STEPS = [
  'Copy the prompt from Import in Finlyt.',
  'Send it in your existing Claude chat.',
  "Paste Claude's reply into Finlyt. It checks for duplicates and saves the entries.",
]

export default function ClaudeImport() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked; the text is still selectable */
    }
  }

  return (
    <section id="import" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Import from Claude"
            title="Bring over what you've already tracked."
            desc="If you've been logging expenses in a Claude chat, you can move that history into Finlyt."
          />
          <ol className="mt-8 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} data-reveal style={{ '--d': `${i * 60}ms` }} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="w-4 shrink-0 tabular-nums text-muted">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div data-reveal style={{ '--d': '100ms' }} className="rounded-2xl bg-paper-2 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Prompt</p>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 dark:bg-paper text-xs font-medium transition hover:bg-ink hover:text-paper"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="mt-4 whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-ink/80">{PROMPT}</pre>
        </div>
      </div>
    </section>
  )
}
