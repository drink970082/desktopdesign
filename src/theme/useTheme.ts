import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const KEY = 'deskconf.theme'

function readStored(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    if (t === 'dark' || t === 'light') return t
  } catch {
    /* localStorage may be unavailable (private mode) */
  }
  // No preference saved: follow the OS, defaulting to dark (the original site's default).
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

let current: Theme = 'dark'
const listeners = new Set<() => void>()

/** Apply the persisted/OS theme. Call once before React renders. */
export function initTheme() {
  current = readStored()
  apply(current)
}

export function setTheme(theme: Theme) {
  current = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
  apply(theme)
  listeners.forEach((l) => l())
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** Reactive accessor for the current theme. */
export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  )
}
