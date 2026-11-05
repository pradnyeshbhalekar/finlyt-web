import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { FiDownload } from 'react-icons/fi'
import { APP } from '../config'

const INSTALL_STEPS = [
  'Open this page on your Android phone in Chrome and tap Download APK.',
  'Chrome warns about any app that isn’t from the Play Store. Tap Download anyway.',
  'Open the file. If Android asks, allow Chrome to install unknown apps.',
  'Tap Install, open Finlyt, then allow SMS and notification access so it can see your payments.',
]

export default function Download() {
  const absoluteApk = useMemo(() => new URL(APP.apkUrl, window.location.href).href, [])

  return (
    <section id="download" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div data-reveal>
          <p className="text-sm font-medium text-brand">Download</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Get Finlyt on your phone.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            It isn’t on the Play Store. Download the APK in Chrome and install it like any other app.
          </p>

          <a
            href={APP.apkUrl}
            download
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-medium text-paper transition hover:bg-ink-2 sm:w-auto"
          >
            <FiDownload /> Download APK
          </a>

          <p className="mt-5 text-sm text-muted">
            v{APP.version} · {APP.apkSize} · {APP.minAndroid} · Updated {APP.updated}
          </p>

          <div className="mt-10 hidden items-center gap-5 md:flex">
            {/* Dark modules on white in dark mode too: not every scanner reads an inverted code. */}
            <span className="shrink-0 rounded-lg dark:bg-white dark:p-2">
              <QRCodeSVG value={absoluteApk} size={88} fgColor="#111412" bgColor="transparent" level="M" />
            </span>
            <p className="max-w-[14rem] text-sm leading-relaxed text-muted">
              On a laptop? Scan this with your phone to download it there.
            </p>
          </div>
        </div>

        <div data-reveal style={{ '--d': '100ms' }}>
          <p className="text-sm text-muted">Installing from Chrome</p>
          <ol className="mt-5 border-t border-line">
            {INSTALL_STEPS.map((s, i) => (
              <li key={s} className="flex gap-4 border-b border-line py-4 text-[15px] leading-relaxed">
                <span className="w-4 shrink-0 tabular-nums text-muted">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
