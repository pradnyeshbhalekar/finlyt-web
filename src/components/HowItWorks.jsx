import SectionHeading from './SectionHeading'

const STEPS = [
  {
    title: 'Get nudged',
    desc: 'At the times you set (12, 6 and 11 to start), a notification reminds you to log what you spent.',
  },
  {
    title: 'Say what you spent',
    desc: 'Type or speak a few words, like “dmart 1.2k groceries, auto 120”. UPI and cash, all in one go.',
  },
  {
    title: 'Done',
    desc: 'Our AI turns it into proper entries. Check them, tap Save, and today’s limit and your widgets update.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="About ten seconds per check-in." />

        <ol className="mt-14 grid gap-10 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} data-reveal style={{ '--d': `${i * 70}ms` }} className="border-t border-ink pt-5">
              <p className="text-sm tabular-nums text-muted">0{i + 1}</p>
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
