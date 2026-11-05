import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo />
        <p>© {new Date().getFullYear()} Finlyt · Android only</p>
      </div>
    </footer>
  )
}
