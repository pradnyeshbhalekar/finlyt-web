export default function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div data-reveal className="max-w-xl">
      {eyebrow && <p className="text-sm font-medium text-brand">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-base leading-relaxed text-muted text-pretty">{desc}</p>}
    </div>
  )
}
