// Realistic Android phone shell: metal rim, thin bezel, side buttons, punch-hole camera,
// status bar and gesture handle. Children render inside the screen, between the
// status bar and the gesture handle.
// Nothing on the phone can be selected, copied or dragged; text fields inside still work.
import { MdSignalCellularAlt, MdWifi, MdBattery5Bar } from 'react-icons/md'
import { noCopy } from '../lib/noCopy'

export default function PhoneFrame({ children, dark = false, time = '6:00', screenClass = 'bg-white' }) {
  const fg = dark ? 'text-white' : 'text-ink'

  return (
    <div {...noCopy} className="relative mx-auto w-[min(290px,100%)] select-none [&_input]:select-text">
      {/* side buttons: power + volume rocker */}
      <span aria-hidden="true" className="absolute -right-[2.5px] top-[118px] h-[38px] w-[3.5px] rounded-r-[2px] bg-[linear-gradient(90deg,#3b3f3d,#7a7e7c)]" />
      <span aria-hidden="true" className="absolute -right-[2.5px] top-[176px] h-[70px] w-[3.5px] rounded-r-[2px] bg-[linear-gradient(90deg,#3b3f3d,#7a7e7c)]" />

      {/* metal rim */}
      <div className="relative rounded-[3rem] bg-[linear-gradient(150deg,#8a8e8c_0%,#2b2e2d_18%,#1b1d1c_50%,#2f3231_82%,#9a9e9c_100%)] p-[2.5px] shadow-[0_60px_90px_-45px_rgb(17_20_18/0.55),0_25px_40px_-25px_rgb(17_20_18/0.4)]">
        {/* bezel */}
        <div className="rounded-[2.85rem] bg-black p-[7px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]">
          {/* screen */}
          <div className={`relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.45rem] ${screenClass}`}>
            {/* status bar */}
            <div className={`relative z-20 flex h-9 shrink-0 items-center justify-between px-6 pt-0.5 text-[11px] font-medium ${fg}`}>
              <span className="tabular-nums">{time}</span>
              <span className="flex items-center gap-0.5 text-[13px]">
                <MdSignalCellularAlt />
                <MdWifi />
                <MdBattery5Bar className="rotate-90" />
              </span>
            </div>

            {/* punch-hole camera */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[11px] z-30 h-[13px] w-[13px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2a3140_0%,#0a0b0d_45%,#000_100%)] shadow-[0_0_0_1.5px_#050505]"
            />

            <div className="flex min-h-0 flex-1 flex-col">{children}</div>

            {/* gesture handle */}
            <div className="flex h-5 shrink-0 items-center justify-center">
              <span className={`h-[4px] w-[100px] rounded-full ${dark ? 'bg-white/75' : 'bg-ink/80'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
