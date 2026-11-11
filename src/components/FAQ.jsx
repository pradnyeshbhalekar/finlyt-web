import { FiPlus } from 'react-icons/fi'
import SectionHeading from './SectionHeading'

const QA = [
  {
    q: 'Why isn’t Finlyt on the Play Store?',
    a: 'It’s a personal app, so it’s shared as a direct APK instead of a store listing. New versions will be posted on this page.',
  },
  {
    q: 'Is installing an APK safe?',
    a: 'Chrome warns about every APK that doesn’t come from the Play Store, whatever the app is. Only download Finlyt from this page. You can switch off Install unknown apps for Chrome once it’s installed.',
  },
  {
    q: 'Does Finlyt read my SMS or bank messages?',
    a: 'No. Finlyt doesn’t ask for SMS access and never reads your messages. It only knows what you tell it. The microphone is on only after you tap the mic, and notifications are just for your reminders.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Entries are saved to Finlyt’s cloud database. What you type or say is processed by our AI to work out the amount, category and split.',
  },
  {
    q: 'Can I change when the reminders come?',
    a: 'Yes. They start at 12 PM, 6 PM and 11 PM. You can move any of them, add more or turn them off.',
  },
  {
    q: 'Is there an iPhone version?',
    a: 'Not right now. Finlyt is built and tested for Android only.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeading eyebrow="FAQ" title="Questions" />
        <div className="border-t border-line">
          {QA.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <FiPlus className="shrink-0 text-muted transition-transform group-open:rotate-45" />
              </summary>
              <p className="-mt-1 pb-5 pr-8 text-[15px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
