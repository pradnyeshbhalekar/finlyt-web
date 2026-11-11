import { FiBell, FiMessageCircle, FiClipboard, FiCloud, FiTarget } from 'react-icons/fi'
import { LuSplit, LuSparkles } from 'react-icons/lu'
import SectionHeading from './SectionHeading'

const FEATURES = [
  {
    icon: FiBell,
    title: 'Reminders on your schedule',
    desc: 'Starts with 12 PM, 6 PM and 11 PM. Move them, add more or switch some off.',
  },
  {
    icon: FiMessageCircle,
    title: 'Plain words, typed or said',
    desc: 'Type or say “chai 40 cash, auto 120”. Our AI works out the amount, the category and how you paid, even in Hinglish.',
  },
  {
    icon: LuSplit,
    title: 'Splits and paybacks',
    desc: 'Say “lunch 450 with Rahul, he owes 200”. Only your share counts as spending, and Finlyt remembers what he owes.',
  },
  {
    icon: FiTarget,
    title: 'A daily limit',
    desc: 'A short weekly check-in turns your monthly budget into a number for each day. What you don’t spend is saved for surprises.',
  },
  {
    icon: LuSparkles,
    title: 'Ask about your money',
    desc: '“Where did my money go this month?” Finlyt answers from your own entries, with a report you can tap through.',
  },
  {
    icon: FiClipboard,
    title: 'Import from an AI chat',
    desc: 'Been tracking in Claude, ChatGPT or Gemini? Paste the reply into Finlyt and your past days, and this month’s plan, come with you.',
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
          desc="UPI, cash or a bit of both: tell Finlyt what you spent, the way you’d tell a friend, and it does the bookkeeping."
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
