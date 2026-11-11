import { useEffect, useRef, useState } from 'react'
import { FiMic, FiPlus, FiPhone, FiMessageSquare, FiCamera, FiCompass, FiRotateCcw, FiX } from 'react-icons/fi'
import PhoneFrame from './PhoneFrame'
import SectionHeading from './SectionHeading'
import { formatINR } from '../config'
import { parseQuickLog } from '../lib/parseExpense'
import cameraPhoto from '../assets/camera-photo.jpg'

const WIDGETS = [
  { id: 'today', name: 'Today', size: '2×2', desc: "Today's spend against your daily budget." },
  { id: 'nudge', name: 'Next check-in', size: '2×2', desc: 'When the next reminder comes, and whether today is logged.' },
  { id: 'quick', name: 'Log an expense', size: '4×1', desc: 'Type or speak an expense from the home screen.' },
  { id: 'week', name: 'Last 7 days', size: '4×2', desc: 'The last seven days, with today highlighted.' },
]

const BUDGET = 1500
const START_SPENT = 1240 // today's spend before the visitor logs anything
const PAST_DAYS = [820, 1460, 2100, 640, 980, 560] // the six days before today
const EXAMPLES = ['chai 40', 'auto 120', 'groceries 350', 'lunch 180', 'movie 450']

// Only the camera works: it opens a photo full-screen on the phone.
const DOCK = [{ Icon: FiPhone }, { Icon: FiMessageSquare }, { Icon: FiCompass }, { Icon: FiCamera, camera: true }]

// e.g. "Wed, 5 Nov"
function formatDate(d) {
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  return `${weekday}, ${d.getDate()} ${month}`
}

// The last seven days, ending with today.
function lastSevenDates(today) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })
}

function Ring({ value, over }) {
  const r = 17
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 44 44" className="h-8 w-8 -rotate-90" aria-hidden="true">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--color-line)" strokeWidth="4.5" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={over ? 'var(--color-warn)' : 'var(--color-brand)'}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(1, value))}
        style={{ transition: 'stroke-dashoffset 500ms ease, stroke 300ms ease' }}
      />
    </svg>
  )
}

// The list next to the phone is the accessible control for highlighting; clicking a tile's
// surface is a shortcut. Using a control inside a tile clears the highlight instead, so
// nothing is dimmed while you play with it.
function Tile({ id, active, onSelect, className = '', rounded = 'rounded-[1.35rem]', children }) {
  const dim = active && active !== id
  const on = active === id
  return (
    <div
      onClick={(e) => onSelect(e.target.closest('button, input') ? null : id)}
      className={`relative cursor-pointer overflow-hidden bg-white ${rounded} transition duration-300 ${className} ${
        dim ? 'opacity-30' : ''
      } ${on ? 'shadow-[0_0_0_2px_var(--color-brand)]' : ''}`}
    >
      {children}
    </div>
  )
}

function HomeScreen({ active, onSelect }) {
  const [now] = useState(() => new Date())
  const dates = lastSevenDates(now)

  const [spent, setSpent] = useState(START_SPENT)
  const [text, setText] = useState('')
  const [day, setDay] = useState(null) // index of the bar being inspected
  const [toast, setToast] = useState({ text: '', show: false })
  const inputRef = useRef(null)
  const toastTimer = useRef(0)
  const nextExample = useRef(0)
  const [cameraOpen, setCameraOpen] = useState(false)
  const cameraRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => () => clearTimeout(toastTimer.current), [])
  useEffect(() => {
    if (cameraOpen) closeRef.current?.focus({ preventScroll: true })
  }, [cameraOpen])

  const closeCamera = () => {
    setCameraOpen(false)
    cameraRef.current?.focus({ preventScroll: true })
  }

  const week = [...PAST_DAYS, spent]
  const weekMax = Math.max(...week)
  const over = spent > BUDGET

  const say = (message) => {
    clearTimeout(toastTimer.current)
    setToast({ text: message, show: true })
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return inputRef.current?.focus({ preventScroll: true })
    const entry = parseQuickLog(text)
    if (!entry) return say('Add an amount, like “chai 40”')
    setSpent((s) => s + entry.amount)
    setText('')
    say(`Logged ${formatINR(entry.amount)} · ${entry.category}`)
  }

  const fillExample = () => {
    setText(EXAMPLES[nextExample.current++ % EXAMPLES.length])
    inputRef.current?.focus({ preventScroll: true })
  }

  const reset = () => {
    clearTimeout(toastTimer.current)
    setSpent(START_SPENT)
    setText('')
    setDay(null)
    setToast({ text: '', show: false })
  }

  return (
    <div>
      <PhoneFrame dark time="6:02" screenClass="bg-[linear-gradient(180deg,#2a2d36_0%,#15171c_100%)]">
        <div className="relative flex min-h-0 flex-1 flex-col px-3.5">
          <p className="px-1 pt-5 text-[19px] font-medium text-white">{formatDate(now)}</p>

          <div className="mt-6 grid auto-rows-[54px] grid-cols-4 gap-2.5 text-ink">
            <Tile id="today" active={active} onSelect={onSelect} className="col-span-2 row-span-2 flex flex-col justify-between p-3">
              <div className="flex items-start justify-between">
                <span className="text-[10.5px] text-muted">Today</span>
                <Ring value={spent / BUDGET} over={over} />
              </div>
              <div>
                <p
                  key={spent}
                  className={`animate-in text-[19px] font-semibold leading-none tracking-tight tabular-nums ${over ? 'text-warn' : ''}`}
                >
                  {formatINR(spent)}
                </p>
                <p className={`mt-1 text-[10px] ${over ? 'text-warn' : 'text-muted'}`}>
                  {over ? `${formatINR(spent - BUDGET)} over budget` : `of ${formatINR(BUDGET)}`}
                </p>
              </div>
            </Tile>

            <Tile id="nudge" active={active} onSelect={onSelect} className="col-span-2 row-span-2 flex flex-col justify-between p-3">
              <span className="text-[10.5px] text-muted">Next check-in</span>
              <div>
                <p className="text-[19px] font-semibold leading-none tracking-tight">11 PM</p>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-muted">
                  <i className="h-1.5 w-1.5 rounded-full bg-line" />Logged today
                </p>
              </div>
            </Tile>

            <Tile
              id="quick"
              active={active}
              onSelect={onSelect}
              rounded="rounded-full"
              className="col-span-4 focus-within:shadow-[0_0_0_2px_var(--color-brand)]"
            >
              <form onSubmit={submit} className="flex h-full items-center gap-1.5 px-1.5">
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => onSelect(null)}
                  placeholder="Log an expense…"
                  aria-label="Log an expense, like chai 40"
                  enterKeyHint="done"
                  autoComplete="off"
                  maxLength={60}
                  className="min-w-0 flex-1 bg-transparent pl-3 text-base text-ink outline-none placeholder:text-[12px] placeholder:text-muted sm:text-[12px]"
                />
                <button
                  type="button"
                  onClick={fillExample}
                  aria-label="Fill in an example"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <FiMic />
                </button>
                <button
                  type="submit"
                  aria-label="Log it"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform active:scale-90"
                >
                  <FiPlus />
                </button>
              </form>
            </Tile>

            <Tile id="week" active={active} onSelect={onSelect} className="col-span-4 row-span-2 flex flex-col p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[10.5px] text-muted">
                  {day === null ? 'Last 7 days' : day === 6 ? 'Today' : formatDate(dates[day])}
                </span>
                <span className="text-[14px] font-semibold tabular-nums">
                  {formatINR(day === null ? week.reduce((s, v) => s + v, 0) : week[day])}
                </span>
              </div>
              <div className="mt-auto flex h-[64px] items-end gap-2" onMouseLeave={() => setDay(null)}>
                {week.map((v, i) => {
                  const today = i === week.length - 1
                  const on = day === i
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDay(i)}
                      onPointerEnter={(e) => e.pointerType === 'mouse' && setDay(i)}
                      aria-label={`${formatDate(dates[i])}: ${formatINR(v)}`}
                      aria-pressed={on}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1 rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <span
                        className={`w-full rounded-[4px] transition-[height,background-color] duration-500 ${
                          today ? 'bg-brand' : on ? 'bg-ink/25' : 'bg-paper-2'
                        }`}
                        style={{ height: `${Math.max(7, (v / weekMax) * 48)}px` }}
                      />
                      <span className={`text-[9px] ${today || on ? 'font-medium text-ink' : 'text-muted'}`}>
                        {dates[i].toLocaleDateString('en-US', { weekday: 'narrow' })}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Tile>
          </div>

          {/* confirmation toast */}
          <p
            role="status"
            className={`pointer-events-none absolute inset-x-0 bottom-16 mx-auto w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink shadow-lg transition duration-300 ${
              toast.show ? 'opacity-100' : 'translate-y-1 opacity-0'
            }`}
          >
            {toast.text}
          </p>

          {/* dock */}
          <div className="mt-auto flex justify-around px-1 pb-3">
            {DOCK.map(({ Icon, camera }, i) =>
              camera ? (
                <button
                  key={i}
                  ref={cameraRef}
                  type="button"
                  onClick={() => setCameraOpen(true)}
                  aria-label="Open camera"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[17px] text-white/80 transition hover:bg-white/20 hover:text-white active:scale-90"
                >
                  <Icon />
                </button>
              ) : (
                <span
                  key={i}
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[17px] text-white/80"
                >
                  <Icon />
                </span>
              ),
            )}
          </div>
        </div>

        {/* camera: covers the whole screen, under the status bar */}
        {cameraOpen && (
          <div
            role="dialog"
            aria-label="Camera"
            onKeyDown={(e) => e.key === 'Escape' && closeCamera()}
            className="animate-in absolute inset-0 z-10 bg-black"
          >
            <img
              src={cameraPhoto}
              alt="Selfie of a smiling man with a pig's face, by the sea"
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/45 to-transparent" />
            <button
              ref={closeRef}
              type="button"
              onClick={closeCamera}
              aria-label="Close camera"
              className="absolute left-3 top-11 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
            >
              <FiX />
            </button>
          </div>
        )}
      </PhoneFrame>

      <p className="mt-5 text-center text-sm text-muted">
        <span className="font-medium text-ink">Try it.</span> Log something like “chai 40”.
        {spent !== START_SPENT && (
          <button
            type="button"
            onClick={reset}
            className="ml-2 inline-flex items-center gap-1 font-medium text-ink underline-offset-4 hover:underline"
          >
            <FiRotateCcw className="text-xs" /> Reset
          </button>
        )}
      </p>
    </div>
  )
}

export default function Widgets() {
  const [active, setActive] = useState(null)

  return (
    <section id="widgets" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Widgets"
            title="Check your spending from the home screen."
            desc="See today's spend against your limit, or add an expense with one tap."
          />

          <ul className="mt-10 border-t border-line" onMouseLeave={() => setActive(null)}>
            {WIDGETS.map((w) => {
              const on = active === w.id
              return (
                <li key={w.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActive(w.id)}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(w.id)}
                    onFocus={() => setActive(w.id)}
                    aria-pressed={on}
                    className="flex w-full items-baseline gap-4 py-3.5 text-left"
                  >
                    <span className={`w-32 shrink-0 font-medium transition-colors ${on ? 'text-brand' : ''}`}>
                      {w.name}
                    </span>
                    <span className="flex-1 text-[14.5px] leading-snug text-muted">{w.desc}</span>
                    <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">{w.size}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div data-reveal style={{ '--d': '100ms' }}>
          <HomeScreen active={active} onSelect={setActive} />
        </div>
      </div>
    </section>
  )
}
