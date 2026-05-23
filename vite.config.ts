import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deployed to GitHub Pages at https://drink970082.github.io/desktopdesign/
// so all asset URLs must be prefixed with this base.
// https://vite.dev/config/
export default defineConfig({
  base: '/desktopdesign/',
  plugins: [react(), tailwindcss()],
})
