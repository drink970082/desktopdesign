# DeskSpacing

A modern, browser-based **3D desk-setup configurator** — design and visualize your battlestation
before you buy. Pick a desk, add monitors / keyboards / mice / speakers / chairs and gear, arrange
them in 3D, then save, share, or screenshot the result.

This is a ground-up rebuild of the original DeskSpacing (which ran on Three.js r116 + jQuery in a
single 230 KB HTML file) on a modern stack.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **three.js** via **react-three-fiber 9** + **@react-three/drei 10** (3D scene, controls, gizmos)
- **zustand 5** (editor state) · **lz-string** (compact share links) · **react-router-dom 7** (HashRouter)
- **Tailwind CSS 4** (UI)

## Requirements

- **Node 24** (see `.nvmrc`): `nvm use`

## Develop

```bash
npm install
npm run dev       # http://localhost:5173/desktopdesign/
npm run verify    # typecheck + lint + production build (run before committing)
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## Deploy

Hosted on **GitHub Pages** at `https://drink970082.github.io/desktopdesign/`. The Vite `base`
is `/desktopdesign/` and routing uses `HashRouter`, so deep links and refreshes work without
server rewrites.

Publish the current build to the `gh-pages` branch:

```bash
npm run build
npm run deploy   # gh-pages -d dist (includes .nojekyll)
```

Prefer push-to-deploy via GitHub Actions instead? A ready workflow is in
`deploy/github-pages-workflow.yml` — move it to `.github/workflows/` (requires a token with the
`workflow` scope) and set the repo's Pages source to "GitHub Actions".
