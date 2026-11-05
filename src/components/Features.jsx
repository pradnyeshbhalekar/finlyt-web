import { FiBell, FiZap, FiMessageCircle, FiClipboard, FiCloud } from 'react-icons/fi'
import { LuSplit } from 'react-icons/lu'
import SectionHeading from './SectionHeading'

const FEATURES = [
  {
    icon: FiBell,
    title: 'Reminders on your schedule',
    desc: 'Starts with 12 PM, 6 PM and 11 PM. Move them, add more or switch some off. You only get asked about payments you haven’t logged.',
  },
  {
    icon: FiZap,
    title: 'Payments detected for you',
    desc: 'Reads payment alerts from your bank and from GPay, PhonePe and Paytm. Amount, merchant and time are filled in already.',
  },
  {
    icon: FiMessageCircle,
    title: 'Plain words',
    desc: 'Type “auto back from office” or “groceries, 200 more in cash”. Our AI works out the category and the split.',
  },
  {
    icon: LuSplit,
    title: 'Half UPI, half cash',
    desc: 'Paid part on UPI and part in cash? Say so in one sentence and both get logged.',
  },
  {
    icon: FiClipboard,
    title: 'Import from Claude',
    desc: 'Been tracking in a Claude chat? Paste its export into Finlyt and your past days come with you.',
  },
  {
    icon: FiCloud,
    title: 'Synced as you go',
    desc: 'Every entry is saved to the cloud, so reinstalling or switching phones loses nothing.',
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Built for how you actually spend."
          desc="Most payments go through UPI and some are cash. Finlyt handles both, so all you type is what the money was for."
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} data-reveal style={{ '--d': `${(i % 3) * 60}ms` }}>
              <f.icon className="text-xl text-brand" />
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
