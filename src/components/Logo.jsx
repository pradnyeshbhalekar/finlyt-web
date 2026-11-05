import { useEffect, useRef } from 'react'
import { noCopy } from '../lib/noCopy'

// Finlyt mark ("Buddy" from the logo canvas) next to the wordmark.
// Pressing a button or link anywhere on the page makes him hop, excited.
// With reduced motion he stays still.
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

export default function Logo({ className = 'gap-2 text-lg', markClassName = 'h-7 w-7' }) {
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
    <span
      {...noCopy}
      className={`inline-flex select-none items-center font-semibold leading-none tracking-tight text-ink ${className}`}
    >
      <svg
        ref={markRef}
        viewBox="20 22 60 60"
        className={`block shrink-0 overflow-visible ${markClassName}`}
        style={{ transformOrigin: '50% 100%' }}
        aria-hidden="true"
      >
        <g transform="rotate(-8 50 52)">
          <rect x="21" y="23" width="58" height="58" rx="26" fill="var(--color-brand)" />
          <ellipse cx="56" cy="47" rx="5" ry="8" fill="#fff" />
          <ellipse cx="69" cy="47" rx="5" ry="8" fill="#fff" />
        </g>
      </svg>
      finlyt
    </span>
  )
}
