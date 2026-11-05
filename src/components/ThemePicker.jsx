import { useEffect, useState } from 'react'
import { THEMES, applyTheme, onSystemThemeChange, saveTheme, systemTheme } from '../lib/theme'

// Three swatches in the header: light, navy or black background. Real radio buttons,
// so arrow keys move between them.
export default function ThemePicker() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || systemTheme())

  useEffect(
    () =>
      onSystemThemeChange((t) => {
        applyTheme(t)
        setTheme(t)
      }),
    [],
  )

  const choose = (id) => {
    applyTheme(id)
    saveTheme(id)
    setTheme(id)
  }

  return (
    <fieldset className="flex items-center">
      <legend className="sr-only">Background</legend>
      {THEMES.map((t) => (
        <label key={t.id} title={t.label} className="grid h-8 w-8 cursor-pointer place-items-center">
          <input
            type="radio"
            name="theme"
            value={t.id}
            checked={theme === t.id}
            onChange={() => choose(t.id)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="h-[18px] w-[18px] rounded-full shadow-[inset_0_0_0_1px_rgb(128_128_128/0.5)] transition-shadow peer-checked:ring-2 peer-checked:ring-brand peer-checked:ring-offset-2 peer-checked:ring-offset-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand"
            style={{ background: t.paper }}
          />
          <span className="sr-only">{t.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
