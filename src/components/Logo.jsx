import { useEffect, useRef } from 'react'
import { noCopy } from '../lib/noCopy'

// The Finlyt logo from the logo canvas ("no background" board): the coin agent next to
// the "finlyt" wordmark. Colours come from the --color-logo-* tokens in index.css, which
// switch to the on-dark version in dark mode. Pressing a button or link anywhere on the
// page makes the coin hop, excited. With reduced motion it stays still.
//
// Both halves share a frame 76 units tall and the wordmark's viewBox includes the gap
// after the coin, so at any height the lockup is 269/76 (about 3.54) times as wide.
const CLICKABLE = 'button, a[href], summary, [role="button"], input[type="submit"]'
// Crouch, jump with a stretch, land with a squash, a smaller second hop, settle.
const HOP = [
  { transform: 'translateY(0) scale(1, 1) rotate(0)' },
  { transform: 'translateY(4%) scale(1.14, 0.86) rotate(0)', offset: 0.12 },
  { transform: 'translateY(-30%) scale(0.9, 1.12) rotate(-7deg)', offset: 0.34 },
  { transform: 'translateY(0) scale(1.12, 0.88) rotate(0)', offset: 0.54 },
  { transform: 'translateY(-13%) scale(0.96, 1.05) rotate(6deg)', offset: 0.72 },
  { transform: 'translateY(0) scale(1.04, 0.96) rotate(0)', offset: 0.88 },
  { transform: 'translateY(0) scale(1, 1) rotate(0)' },
]

// The coin agent, rolling at -10°, without the app icon's square. `lively` makes it do what the
// app's coin does at rest: its normal face, then a smile with a little hop, over and over (the
// coin-* animations in index.css, on the same 2.6 s + 1.5 s clock as the app).
export function Mark({ ref, eyesRef, lively = false, style, ...props }) {
  return (
    <svg ref={ref} viewBox="18 12 64 76" aria-hidden="true" style={{ aspectRatio: '64 / 76', ...style }} {...props}>
      <g transform="translate(-1.48 -1.74) rotate(-10 50 52)">
        <g className={lively ? 'coin-hop' : undefined} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
          <path d="M47 21H56A26 31 0 0 1 56 83H47Z" className="fill-logo-edge" />
          <ellipse cx="47" cy="52" rx="26" ry="31" className="fill-logo-face" />
          <ellipse cx="47" cy="52" rx="20" ry="25" fill="none" strokeWidth="3" className="stroke-logo-ring" />
          <g
            ref={eyesRef}
            className={`fill-logo-eyes ${lively ? 'coin-eyes-open' : ''}`}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <ellipse cx="40.5" cy="51" rx="5" ry="7.6" />
            <ellipse cx="53.5" cy="51" rx="5" ry="7.6" />
          </g>
          {lively && (
            <g className="coin-eyes-smile stroke-logo-eyes" fill="none" strokeWidth="3.4" strokeLinecap="round">
              <path d="M36.4 53.4Q39.8 45.4 43.2 53.4" />
              <path d="M50.8 53.4Q54.2 45.4 57.6 53.4" />
            </g>
          )}
        </g>
      </g>
    </svg>
  )
}

// "finlyt", one path per letter (baseline at y=0) so the splash can bring them in one by one.
const LETTERS = [
  {
    d: 'M29.44 -40.22H21.18V-42.39C21.18 -45.44 22.32 -46.62 25.44 -46.62H29.44V-56.75H22.13C12.57 -56.75 8.04 -52.86 8.04 -44.67V-40.22H0.72V-30.09H8.04V0H21.18V-30.09H29.44Z',
  },
  {
    d: 'M34.62 0H47.72V-40.22H34.62Z',
    dot: 'M41.13 -44.14C45.36 -44.14 48.37 -46.92 48.37 -50.77C48.37 -54.62 45.36 -57.36 41.13 -57.36C36.94 -57.36 33.93 -54.62 33.93 -50.77C33.93 -46.92 36.94 -44.14 41.13 -44.14Z',
  },
  {
    d: 'M66.64 -21.86C66.64 -27.35 69.3 -29.9 73.45 -29.9C77.6 -29.9 80 -27.31 80 -22.55V0H93.11V-25.29C93.11 -35.19 88 -41.09 79.28 -41.09C73.22 -41.09 69.15 -38.31 66.48 -33.71V-40.22H53.53V0H66.64Z',
  },
  { d: 'M112.02 -56.75H98.92V0H112.02Z' },
  {
    d: 'M119.09 15.92H127.89C134.63 15.92 138.47 12.95 141.22 5.67L158.55 -40.22H144.99L138.93 -21.71C138.06 -18.93 137.22 -16.11 136.46 -13.29C135.66 -16.11 134.86 -18.93 133.98 -21.71L128.04 -40.22H114.33L129.79 -0.08L129.11 1.75C128.15 4.68 127.39 5.75 124.65 5.75H119.09Z',
  },
  {
    d: 'M186.22 -40.22H177.96V-51.19H164.82V-40.22H157.96V-30.09H164.82V-11.31C164.82 -3.5 169.16 0 178.79 0H186.22V-10.13H181.69C178.75 -10.13 177.96 -10.93 177.96 -13.52V-30.09H186.22Z',
  },
]
export const LETTER_COUNT = LETTERS.length

export function Wordmark({ letterRef, letterStyle, style, ...props }) {
  return (
    <svg viewBox="-17 -58.11 205 76" aria-hidden="true" style={{ aspectRatio: '205 / 76', ...style }} {...props}>
      {LETTERS.map((l, i) => (
        <g
          key={i}
          ref={
            letterRef &&
            ((el) => {
              letterRef(el, i)
            })
          }
          style={letterStyle}
        >
          <path d={l.d} className="fill-logo-text" />
          {l.dot && <path d={l.dot} className="fill-logo-dot" />}
        </g>
      ))}
    </svg>
  )
}

// `size` is a height class; the width follows from it.
export default function Logo({ size = 'h-6' }) {
  const markRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hop = () => markRef.current.animate(HOP, { duration: 720, easing: 'ease-out' })
    const onDown = (e) => {
      if (e.target.closest?.(CLICKABLE)) hop()
    }
    // Buttons pressed from the keyboard (Enter/Space) fire a click with no pointer.
    const onClick = (e) => {
      if (e.detail === 0 && e.target.closest?.(CLICKABLE)) hop()
    }

    const capture = { capture: true, passive: true }
    window.addEventListener('pointerdown', onDown, capture)
    window.addEventListener('click', onClick, capture)
    return () => {
      window.removeEventListener('pointerdown', onDown, capture)
      window.removeEventListener('click', onClick, capture)
    }
  }, [])

  return (
    <span {...noCopy} role="img" aria-label="Finlyt" className="inline-flex select-none align-top">
      <Mark
        ref={markRef}
        lively
        className={`block w-auto shrink-0 overflow-visible ${size}`}
        style={{ transformOrigin: '50% 100%' }}
      />
      <Wordmark className={`block w-auto shrink-0 ${size}`} />
    </span>
  )
}
