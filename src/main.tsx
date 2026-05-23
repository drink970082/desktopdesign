import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { initTheme } from './theme/useTheme'

// Apply persisted theme before first paint to avoid a flash.
initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter so refreshes/deep links work on GitHub Pages without server rewrites. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
