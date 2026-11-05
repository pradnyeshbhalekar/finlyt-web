import { useEffect, useRef, useState } from 'react'
import { LETTER_COUNT, Mark, Wordmark } from './Logo'

// Intro: the mark pops into the middle of the screen and dances, "finlyt" comes in
// letter by letter, then the whole logo flies into its place in the header while the
// page fades in. Click, scroll or press a key to fast-forward. Off for reduced motion.
//
// The splash draws the same mark and wordmark as the header logo, only bigger (3.5x the
// 28px header height), so after the flight it lines up exactly with the real one and
// swaps for it.

const HEIGHT = 'min(98px, 21.8vw)'
const LETTER_STYLE = { opacity: 0, transformBox: 'fill-box', transformOrigin: '50% 100%' }

// Timeline, in ms from the start
const DANCE_AT = 400
const SLIDE_AT = 1450 // the mark moves left to make room for the letters
const LETTERS_AT = 1500
const LETTER_GAP = 80
const LETTER_MS = 420
const LANDED_AT = LETTERS_AT + (LETTER_COUNT - 1) * LETTER_GAP + LETTER_MS
const FLY_AT = LANDED_AT + 380
const FLY_MS = 650

const POP = [
  { transform: 'scale(0)', opacity: 0 },
  { transform: 'scale(1.15)', opacity: 1, offset: 0.6 },
  { transform: 'scale(0.95)', opacity: 1, offset: 0.8 },
  { transform: 'scale(1)', opacity: 1 },
]
// Sway side to side on two little hops, then one big jump.
const DANCE = [
  { transform: 'translateY(0) rotate(0) scale(1, 1)' },
  { transform: 'translateY(0) rotate(-12deg) scale(1.06, 0.94)', offset: 0.14 },
  { transform: 'translateY(-16%) rotate(-4deg) scale(0.95, 1.06)', offset: 0.28 },
  { transform: 'translateY(0) rotate(12deg) scale(1.06, 0.94)', offset: 0.42 },
  { transform: 'translateY(-16%) rotate(4deg) scale(0.95, 1.06)', offset: 0.56 },
  { transform: 'translateY(0) rotate(-10deg) scale(1.06, 0.94)', offset: 0.7 },
  { transform: 'translateY(-24%) rotate(0) scale(0.92, 1.1)', offset: 0.85 },
  { transform: 'translateY(0) rotate(0) scale(1, 1)' },
]
const BLINK = [
  { transform: 'scaleY(1)' },
  { transform: 'scaleY(1)', offset: 0.32 },
  { transform: 'scaleY(0.1)', offset: 0.37 },
  { transform: 'scaleY(1)', offset: 0.42 },
  { transform: 'scaleY(1)' },
]
const LETTER_IN = [
  { opacity: 0, transform: 'translateY(50%) scale(0.4)' },
  { opacity: 1, transform: 'translateY(-15%) scale(1.1)', offset: 0.6 },
  { opacity: 1, transform: 'translateY(0) scale(1)' },
]
const HAPPY_HOP = [
  { transform: 'translateY(0) scale(1, 1)' },
  { transform: 'translateY(4%) scale(1.1, 0.9)', offset: 0.2 },
  { transform: 'translateY(-22%) scale(0.94, 1.08)', offset: 0.5 },
  { transform: 'translateY(0) scale(1.06, 0.94)', offset: 0.8 },
  { transform: 'translateY(0) scale(1, 1)' },
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Splash() {
  const [show, setShow] = useState(() => !reducedMotion())
  const overlayRef = useRef(null)
  const bgRef = useRef(null)
  const lockupRef = useRef(null)
  const slideRef = useRef(null)
  const popRef = useRef(null)
  const danceRef = useRef(null)
  const eyesRef = useRef(null)
  const letterRefs = useRef([])

  useEffect(() => {
    if (!show) return
    const root = document.documentElement
    root.dataset.splash = '' // hides the header logo until this one lands on it
    const anims = []
    let cancelled = false

    const play = (el, frames, options) => {
      const a = el.animate(frames, options)
      anims.push(a)
      return a
    }
    const fastForward = () => anims.forEach((a) => a.updatePlaybackRate(5))

    const start = async () => {
      // Letter widths depend on the web font, so wait for it, but not for long.
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1000))])
      if (cancelled) return

      const lockup = lockupRef.current.getBoundingClientRect()
      const mark = slideRef.current.getBoundingClientRect()
      const target = document.querySelector('[data-splash-target] > span')?.getBoundingClientRect()
      // The mark starts alone in the middle of the screen.
      const center = lockup.left + lockup.width / 2 - (mark.left + mark.width / 2)

      play(popRef.current, POP, { duration: 450, easing: 'ease-out', fill: 'both' })
      play(danceRef.current, DANCE, { delay: DANCE_AT, duration: 1000, easing: 'ease-in-out' })
      play(eyesRef.current, BLINK, { delay: DANCE_AT, duration: 1000 })
      play(slideRef.current, [{ transform: `translateX(${center}px)` }, { transform: 'translateX(0)' }], {
        delay: SLIDE_AT,
        duration: 500,
        easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
        fill: 'backwards',
      })
      letterRefs.current.forEach((el, i) =>
        play(el, LETTER_IN, { delay: LETTERS_AT + i * LETTER_GAP, duration: LETTER_MS, easing: 'ease-out', fill: 'both' }),
      )
      play(danceRef.current, HAPPY_HOP, { delay: LANDED_AT, duration: 480, easing: 'ease-out' })

      const fly = target
        ? play(
            lockupRef.current,
            [
              { transform: 'none' },
              {
                transform: `translate(${target.left - lockup.left}px, ${target.top - lockup.top}px) scale(${target.width / lockup.width})`,
              },
            ],
            { delay: FLY_AT, duration: FLY_MS, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'forwards' },
          )
        : play(lockupRef.current, [{ opacity: 1 }, { opacity: 0 }], { delay: FLY_AT, duration: 400, fill: 'forwards' })
      play(bgRef.current, [{ opacity: 1 }, { opacity: 0 }], {
        delay: FLY_AT + 50,
        duration: FLY_MS - 50,
        easing: 'ease-out',
        fill: 'forwards',
      })

      try {
        await fly.finished
        // Show the real header logo underneath and fade this one off it, so any
        // sub-pixel difference in letter spacing doesn't flicker.
        delete root.dataset.splash
        await play(lockupRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }).finished
      } catch {
        return // cancelled
      }
      setShow(false)
    }
    start()

    const overlay = overlayRef.current
    overlay.addEventListener('pointerdown', fastForward)
    window.addEventListener('keydown', fastForward)
    window.addEventListener('wheel', fastForward, { passive: true })
    return () => {
      cancelled = true
      anims.forEach((a) => a.cancel())
      overlay.removeEventListener('pointerdown', fastForward)
      window.removeEventListener('keydown', fastForward)
      window.removeEventListener('wheel', fastForward)
      delete root.dataset.splash
    }
  }, [show])

  if (!show) return null

  return (
    <div ref={overlayRef} aria-hidden="true" className="fixed inset-0 z-[100] cursor-pointer select-none">
      <div ref={bgRef} className="absolute inset-0 bg-paper" />
      <div className="absolute inset-0 grid place-items-center">
        <span ref={lockupRef} className="inline-flex" style={{ transformOrigin: '0 0' }}>
          <span ref={slideRef} className="block">
            <span ref={popRef} className="block" style={{ opacity: 0 }}>
              <Mark
                ref={danceRef}
                eyesRef={eyesRef}
                className="block w-auto overflow-visible"
                style={{ height: HEIGHT, transformOrigin: '50% 100%' }}
              />
            </span>
          </span>
          <Wordmark
            className="block w-auto overflow-visible"
            style={{ height: HEIGHT }}
            letterStyle={LETTER_STYLE}
            letterRef={(el, i) => {
              letterRefs.current[i] = el
            }}
          />
        </span>
      </div>
    </div>
  )
}
