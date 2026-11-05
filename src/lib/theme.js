// Background themes. The visitor's pick is saved; until they pick, the system setting
// decides between light and navy. The inline script in index.html applies the same rule
// before the first paint, so keep the storage key and ids in sync with it.
export const THEMES = [
  { id: 'light', label: 'Light', paper: '#fafaf9' },
  { id: 'navy', label: 'Navy', paper: '#0b1033' },
  { id: 'black', label: 'Black', paper: '#000000' },
]

const KEY = 'finlyt-theme'
const dark = () => window.matchMedia('(prefers-color-scheme: dark)')

export const systemTheme = () => (dark().matches ? 'navy' : 'light')

export function savedTheme() {
  try {
    const t = localStorage.getItem(KEY)
    return THEMES.some((x) => x.id === t) ? t : null
  } catch {
    return null
  }
}

export function saveTheme(id) {
  try {
    localStorage.setItem(KEY, id)
  } catch {
    // Private mode or blocked storage: the pick lasts until the page is closed.
  }
}

export function applyTheme(id) {
  document.documentElement.dataset.theme = id
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES.find((t) => t.id === id).paper)
}

// Calls back when the system setting changes and the visitor hasn't picked a theme.
export function onSystemThemeChange(callback) {
  const mq = dark()
  const listener = () => !savedTheme() && callback(systemTheme())
  mq.addEventListener('change', listener)
  return () => mq.removeEventListener('change', listener)
}
