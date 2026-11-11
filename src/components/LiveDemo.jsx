// The app's Home screen, working: type what you spent the way you'd say it, check what Finlyt
// made of it, and save. Today's total, the bar against today's limit, the month and Owed tiles
// all follow. Same layout as the app (light theme): no bank SMS, everything is logged by
// typing or speaking.
import { useEffect, useRef, useState } from 'react'
import {
  LuArrowUp,
  LuCar,
  LuCheck,
  LuChevronRight,
  LuCircleAlert,
  LuClapperboard,
  LuHeartPulse,
  LuHistory,
  LuHouse,
  LuMessageCircleMore,
  LuMic,
  LuPencil,
  LuReceipt,
  LuRotateCcw,
  LuShoppingBag,
  LuShoppingBasket,
  LuTag,
  LuTarget,
  LuUndo2,
  LuUserRound,
  LuUtensils,
  LuX,
} from 'react-icons/lu'
import PhoneFrame from './PhoneFrame'
import Logo, { Mark } from './Logo'
import { parseLog } from '../lib/parseExpense'
import { formatINR } from '../config'

const LIMIT = 650 // today's limit, from the plan
const BUDGET = 20000 // this month's budget
const MONTH_BEFORE = 8270 // spent this month before today
const NOW = '6:02 PM'

const START = [
  { id: 2, description: 'Metro', category: 'Transport', total: 30, cash: 0, upi: 30, via: 'UPI', owed: 0, person: null, time: '9:40 AM' },
  { id: 1, description: 'Chai', category: 'Food', total: 40, cash: 40, upi: 0, via: 'UPI', owed: 0, person: null, time: '9:10 AM' },
]

const EXAMPLES = [
  'lunch 450 with Rahul, he owes 200',
  'auto 120, paid 30 more in cash',
  'dmart 1.2k groceries',
  'petrol 500, rapido 74',
  'chai 40 cash',
]

const ICONS = {
  Food: LuUtensils,
  Groceries: LuShoppingBasket,
  Transport: LuCar,
  Shopping: LuShoppingBag,
  Bills: LuReceipt,
  Health: LuHeartPulse,
  Fun: LuClapperboard,
}

const TABS = [
  { label: 'Home', Icon: LuHouse },
  { label: 'Ask', Icon: LuMessageCircleMore },
  { label: 'Plan', Icon: LuTarget },
  { label: 'History', Icon: LuHistory },
]

const MONTH = new Date().toLocaleDateString('en-IN', { month: 'long' })

function paidWith(e) {
  if (e.cash && e.upi) return `${e.via} + Cash`
  return e.cash ? 'Cash' : e.via
}

function Entry({ e, onCard = false, showCategory = false }) {
  const Icon = ICONS[e.category] ?? LuTag
  const share = e.total - e.owed
  const details = [showCategory ? e.category : e.time, paidWith(e), e.owed ? `${e.person} owes you` : null]
  return (
    <li className="animate-in flex items-center gap-2.5 px-1 py-1.5">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] text-muted ${onCard ? 'bg-white' : 'bg-paper-2'}`}
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium">{e.description}</span>
        <span className="block truncate text-[10.5px] text-muted">{details.filter(Boolean).join(' · ')}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-[13px] font-semibold tabular-nums">{formatINR(share)}</span>
        {e.owed > 0 && <span className="block text-[10px] tabular-nums text-muted">of {formatINR(e.total)}</span>}
      </span>
    </li>
  )
}

function Tile({ label, value, note }) {
  return (
    <div className="rounded-2xl bg-paper-2 px-3 py-2.5">
      <p className="flex items-center justify-between text-[10px] text-muted">
        {label} <LuChevronRight className="text-[11px] opacity-60" />
      </p>
      <p key={value} className="animate-in mt-0.5 text-[15px] font-semibold tabular-nums">
        {value}
      </p>
      <p className="text-[10px] text-muted">{note}</p>
    </div>
  )
}

export default function LiveDemo() {
  const [logged, setLogged] = useState(START)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(null) // { entries, words } waiting for a check
  const [saved, setSaved] = useState(null) // { ids, message } for the toast and Undo
  const [notice, setNotice] = useState(null)
  const [example, setExample] = useState(0)
  const timer = useRef()
  const toastTimer = useRef()
  const nextId = useRef(3)
  const inputRef = useRef()

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      clearTimeout(toastTimer.current)
    },
    [],
  )

  const today = logged.reduce((s, e) => s + e.total - e.owed, 0)
  const owed = logged.reduce((s, e) => s + e.owed, 0)
  const left = LIMIT - today
  const changed = logged !== START || text || pending || notice

  const focus = () => inputRef.current?.focus({ preventScroll: true })

  const submit = (e) => {
    e.preventDefault()
    const words = text.trim()
    if (!words) return focus()
    if (busy || pending) return
    setBusy(true)
    setNotice(null)
    setSaved(null)
    timer.current = setTimeout(() => {
      setBusy(false)
      const entries = parseLog(words)
      if (!entries) {
        setNotice('I couldn’t find any spending in that. Add an amount, like “chai 40”.')
        return
      }
      setPending({ entries, words })
      setText('')
    }, 700)
  }

  const save = () => {
    const entries = pending.entries.map((e) => ({ ...e, id: nextId.current++, time: NOW }))
    setLogged((l) => [...entries.reverse(), ...l])
    const n = entries.length
    setSaved({ ids: entries.map((e) => e.id), message: `Saved ${n} ${n === 1 ? 'entry' : 'entries'}` })
    setPending(null)
    setExample((i) => i + 1)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setSaved(null), 6000)
  }

  // The X and Edit both put the words back in the box to change.
  const edit = () => {
    setText(pending.words)
    setPending(null)
    focus()
  }

  const undo = () => {
    setLogged((l) => l.filter((e) => !saved.ids.includes(e.id)))
    setSaved(null)
  }

  const fillExample = () => {
    setText(EXAMPLES[example % EXAMPLES.length])
    setNotice(null)
    focus()
  }

  const reset = () => {
    clearTimeout(timer.current)
    clearTimeout(toastTimer.current)
    setLogged(START)
    setText('')
    setBusy(false)
    setPending(null)
    setSaved(null)
    setNotice(null)
    setExample(0)
  }

  const showHint = !text && !busy && !pending && !saved && !notice

  return (
    <div id="demo">
      <PhoneFrame time="6:02">
        {/* header: the logo, and your photo (Settings) */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-1.5">
          <Logo size="h-5" />
          <span className="grid h-8 w-8 place-items-center rounded-full bg-paper-2 text-[15px] text-muted">
            <LuUserRound />
          </span>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-2">
          {/* today against today's limit */}
          <p className="mt-4 text-[11px] text-muted">Today</p>
          <p key={today} className="animate-in mt-0.5 text-[30px] font-bold leading-none tracking-tight tabular-nums">
            {formatINR(today)}
          </p>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-paper-2">
            <div
              className={`h-1 rounded-full transition-[width] duration-500 ${left < 0 ? 'bg-warn' : 'bg-brand'}`}
              style={{ width: `${Math.min(today / LIMIT, 1) * 100}%` }}
            />
          </div>
          <p className={`mt-1.5 text-[10.5px] ${left < 0 ? 'text-warn' : 'text-muted'}`}>
            {left >= 0
              ? `${formatINR(left)} left of today’s ${formatINR(LIMIT)}`
              : `${formatINR(-left)} over today’s ${formatINR(LIMIT)}`}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Tile label={MONTH} value={formatINR(MONTH_BEFORE + today)} note={`of ${formatINR(BUDGET)}`} />
            <Tile label="Owed" value={formatINR(owed)} note="to you" />
          </div>

          {busy && (
            <div className="animate-in mt-4 flex items-center gap-2.5 rounded-2xl bg-paper-2 p-3">
              <Mark className="h-6 animate-pulse" />
              <span className="text-[12px] text-muted">Reading that…</span>
            </div>
          )}

          {/* what Finlyt understood, for a quick check */}
          {pending && (
            <div className="animate-in mt-4 rounded-3xl bg-paper-2 p-3">
              <div className="flex items-center justify-between pl-1">
                <p className="text-[13px] font-semibold">
                  {pending.entries.length === 1 ? 'Look right?' : `${pending.entries.length} entries. Look right?`}
                </p>
                <button
                  type="button"
                  onClick={edit}
                  aria-label="Discard"
                  className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-white"
                >
                  <LuX />
                </button>
              </div>
              <ul className="mt-1">
                {pending.entries.map((e, i) => (
                  <Entry key={i} e={e} onCard showCategory />
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={edit}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-white text-[12px] font-semibold transition-opacity hover:opacity-80"
                >
                  <LuPencil /> Edit
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <LuCheck /> Save
                </button>
              </div>
            </div>
          )}

          <p className="mt-5 px-1 text-[10px] font-medium uppercase tracking-widest text-muted">Logged today</p>
          <ul className="mt-1">
            {logged.map((e) => (
              <Entry key={e.id} e={e} />
            ))}
          </ul>
          {changed && (
            <button
              type="button"
              onClick={reset}
              className="mt-2 inline-flex items-center gap-1.5 px-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"
            >
              <LuRotateCcw /> Start over
            </button>
          )}
        </div>

        {/* the box at the bottom, and what it says */}
        <div className="shrink-0 px-3 pt-1">
          {saved && (
            <div role="status" className="animate-in mb-1.5 flex items-center gap-2 rounded-2xl bg-ink py-1.5 pl-3 pr-1.5 text-paper">
              <Mark className="h-5" />
              <span className="flex-1 text-[12px] font-medium">{saved.message}</span>
              <button
                type="button"
                onClick={undo}
                className="inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold transition-colors hover:bg-white/10"
              >
                <LuUndo2 /> Undo
              </button>
            </div>
          )}
          {notice && (
            <p role="status" className="animate-in mb-1.5 flex gap-2 rounded-2xl bg-paper-2 px-3 py-2 text-[11px] text-muted">
              <LuCircleAlert className="mt-px shrink-0 text-[13px]" />
              {notice}
            </p>
          )}
          {showHint && (
            <button
              type="button"
              onClick={fillExample}
              className="mb-1.5 max-w-full truncate rounded-full border border-line px-3 py-1.5 text-left text-[11px] text-muted transition-colors hover:border-brand hover:text-brand"
            >
              Try: “{EXAMPLES[example % EXAMPLES.length]}”
            </button>
          )}
          <form onSubmit={submit} className="flex items-center gap-1 rounded-[22px] bg-paper-2 p-1 pl-3.5">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setNotice(null)
              }}
              disabled={busy}
              placeholder="What did you spend on?"
              aria-label="What did you spend on?"
              enterKeyHint="send"
              autoComplete="off"
              maxLength={120}
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-[13px] placeholder:text-muted disabled:opacity-60 sm:text-[13px]"
            />
            <button
              type="button"
              onClick={fillExample}
              aria-label="Fill in an example"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[15px] text-muted transition-colors hover:bg-white hover:text-ink"
            >
              <LuMic />
            </button>
            <button
              type="submit"
              disabled={!text.trim() || busy || !!pending}
              aria-label="Send"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white transition-opacity disabled:opacity-30"
            >
              {busy ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <LuArrowUp className="text-sm" />
              )}
            </button>
          </form>
        </div>

        {/* the tab bar */}
        <nav aria-hidden="true" className="mt-1.5 flex shrink-0 border-t border-line pt-1.5">
          {TABS.map(({ label, Icon }, i) => (
            <span
              key={label}
              className={`flex flex-1 flex-col items-center gap-0.5 text-[9px] ${i === 0 ? 'font-semibold text-brand' : 'text-muted'}`}
            >
              <Icon className="text-[16px]" />
              {label}
            </span>
          ))}
        </nav>
      </PhoneFrame>

      <p className="mt-5 text-center text-sm text-muted">
        <span className="font-medium text-ink">Try it.</span> Type what you spent, the way you’d say it.
      </p>
    </div>
  )
}
