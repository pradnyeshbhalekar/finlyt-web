import { FiDownload, FiArrowRight } from 'react-icons/fi'
import LiveDemo from './LiveDemo'
import { APP } from '../config'

export default function Hero() {
  return (
    <section id="top" className="pb-20 pt-28 sm:pb-28 sm:pt-32 lg:pt-24">
      <div className="mx-auto grid max-w-5xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p data-reveal className="text-sm font-medium text-muted">
            Expense tracker for Android
          </p>

          <h1
            data-reveal
            style={{ '--d': '60ms' }}
            className="mt-4 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl"
          >
            Never forget an expense again.
          </h1>

          <p
            data-reveal
            style={{ '--d': '120ms' }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted text-pretty"
          >
            Finlyt reminds you at the times you pick. Type or say what you spent in plain words, and
            it keeps your month on track.
          </p>

          <div
            data-reveal
            style={{ '--d': '180ms' }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7"
          >
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition hover:bg-ink-2"
            >
              <FiDownload /> Download APK
            </a>
            <a
              href="#demo"
              className="group inline-flex items-center justify-center gap-1.5 font-medium text-ink"
            >
              Try the demo
              <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <p data-reveal style={{ '--d': '240ms' }} className="mt-6 text-sm text-muted">
            v{APP.version} · {APP.minAndroid} · Free
          </p>
        </div>

        <div data-reveal style={{ '--d': '150ms' }}>
          <LiveDemo />
        </div>
      </div>
    </section>
  )
}
