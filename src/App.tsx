import { lazy, Suspense } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Landing from './routes/Landing'
import About from './routes/About'
import { toggleTheme, useTheme } from './theme/useTheme'

// Code-split the 3D editor so three.js/R3F only load when visiting /create.
const Create = lazy(() => import('./routes/Create'))

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
  }`
}

function Nav() {
  const theme = useTheme()
  return (
    <nav className="sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <NavLink to="/" end className="mr-auto text-lg font-semibold tracking-tight">
        DeskSpacing
      </NavLink>
      <NavLink to="/" end className={navLinkClass}>
        Home
      </NavLink>
      <NavLink to="/create" className={navLinkClass}>
        Setup Creator
      </NavLink>
      <NavLink to="/about" className={navLinkClass}>
        About
      </NavLink>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark/light mode"
        className="ml-1 rounded-md p-2 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </nav>
  )
}

export default function App() {
  return (
    <div className="flex h-dvh flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Nav />
      <main className="min-h-0 flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/create"
            element={
              <Suspense
                fallback={
                  <div className="grid h-full place-items-center text-zinc-500 dark:text-zinc-400">
                    Loading editor…
                  </div>
                }
              >
                <Create />
              </Suspense>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
