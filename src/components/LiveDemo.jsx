import { useEffect, useRef, useState } from 'react'
import { FiArrowUp, FiRotateCcw, FiSettings } from 'react-icons/fi'
import PhoneFrame from './PhoneFrame'
import Logo from './Logo'
import { parseExpense } from '../lib/parseExpense'
import { formatINR } from '../config'

const START = [
  { id: 1, merchant: 'Sharma Stores', amount: 320, time: '5:31 PM', hint: 'groceries, paid 200 more in cash' },
  { id: 2, merchant: 'Rapido', amount: 74, time: '4:10 PM', hint: 'auto back from office' },
  { id: 3, merchant: 'Corner Café', amount: 240, time: '11:20 AM', hint: 'coffee with the team, half cash' },
]

function splitLabel(e) {
  return e.cash ? `UPI ${formatINR(e.upi)} + Cash ${formatINR(e.cash)}` : `UPI ${formatINR(e.upi)}`
}

export default function LiveDemo() {
  const [pending, setPending] = useState(START)
  const [selected, setSelected] = useState(START[0].id)
  const [logged, setLogged] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const timer = useRef()
  const inputRef = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const current = pending.find((p) => p.id === selected)
  const total = logged.reduce((s, e) => s + e.total, 0)

  const submit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value || !current || busy) return
    setBusy(true)
    timer.current = setTimeout(() => {
      const entry = parseExpense(value, current)
      const rest = pending.filter((p) => p.id !== current.id)
      setLogged((l) => [entry, ...l])
      setPending(rest)
      setSelected(rest[0]?.id ?? null)
      setText('')
      setBusy(false)
    }, 600)
  }

  const reset = () => {
    clearTimeout(timer.current)
    setPending(START)
    setSelected(START[0].id)
    setLogged([])
    setText('')
    setBusy(false)
  }

  const useHint = (hint) => {
    setText(hint)
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div id="demo">
      <PhoneFrame>
        {/* app bar */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-2">
          <Logo size="h-6" />
          <span className="grid h-8 w-8 place-items-center rounded-full text-[15px] text-muted">
            <FiSettings />
          </span>
        </div>

        {/* summary */}
        <div className="shrink-0 px-5 pt-3">
          <p className="text-[11px] text-muted">6 PM check-in</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-[28px] font-semibold leading-none tracking-tight tabular-nums">{formatINR(total)}</p>
            <p className="text-[11px] text-muted">
              {logged.length} of {START.length} logged
            </p>
          </div>
        </div>

        {/* scrollable body */}
        <div className="no-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-2">
          {pending.length > 0 && (
            <>
              <p className="px-2 text-[10.5px] font-medium uppercase tracking-wider text-muted">To log</p>
              <ul className="mt-1.5 space-y-1">
                {pending.map((p) => {
                  const on = p.id === selected
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(p.id)}
                        aria-pressed={on}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${
                          on ? 'bg-paper-2' : 'hover:bg-paper'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium">{p.merchant}</span>
                          <span className="block text-[11px] text-muted">{p.time} · UPI</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-[13px] font-medium tabular-nums">{formatINR(p.amount)}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-brand' : 'bg-transparent'}`} />
                        </span>
                      </button>
                      {on && !busy && (
                        <button
                          type="button"
                          onClick={() => useHint(p.hint)}
                          className="ml-3 mt-1.5 rounded-full border border-line px-2.5 py-1 text-left text-[11px] text-muted transition-colors hover:border-brand hover:text-brand"
                        >
                          Try: “{p.hint}”
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {pending.length === 0 && (
            <div className="px-2 py-4 text-center">
              <p className="text-[13px] font-medium">All caught up</p>
              <p className="mt-0.5 text-[11px] text-muted">Next check-in at 11 PM</p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-ink hover:text-paper"
              >
                <FiRotateCcw /> Start over
              </button>
            </div>
          )}

          {logged.length > 0 && (
            <>
              <p className="mt-4 px-2 text-[10.5px] font-medium uppercase tracking-wider text-muted">Logged</p>
              <ul className="mt-1.5 space-y-1">
                {logged.map((e) => (
                  <li key={e.id} className="animate-in rounded-2xl px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[13px] font-medium">{e.merchant}</span>
                      <span className="text-[13px] font-medium tabular-nums">{formatINR(e.total)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted">{e.note}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand-deep">
                        {e.category}
                      </span>
                      <span className="text-[10px] text-muted">{splitLabel(e)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* input */}
        <form onSubmit={submit} className="shrink-0 px-3 pt-1">
          <div className="flex items-center gap-2 rounded-full bg-paper-2 p-1.5 pl-4">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!current || busy}
              placeholder={busy ? 'Parsing…' : current ? `What was ${current.merchant}?` : 'Nothing left to log'}
              aria-label="What was this payment for?"
              enterKeyHint="send"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-[13px] placeholder:text-muted disabled:opacity-60 sm:text-[13px]"
            />
            <button
              type="submit"
              disabled={!text.trim() || !current || busy}
              aria-label="Log it"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white transition-opacity disabled:opacity-30"
            >
              {busy ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <FiArrowUp className="text-sm" />
              )}
            </button>
          </div>
        </form>
      </PhoneFrame>

      <p className="mt-5 text-center text-sm text-muted">
        <span className="font-medium text-ink">Try it.</span> Pick a payment and say what it was.
      </p>
    </div>
  )
}
