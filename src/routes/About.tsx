const TECH = [
  'React + react-three-fiber',
  'three.js',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'zustand',
]

const INSPIRATIONS = [
  {
    name: 'DeskSpacing',
    by: 'Cooper Lappenbusch (programming) & Travers Sorenson (3D models)',
    href: 'https://github.com/cooperlappenbusch/DeskSpacing.com',
    note: 'The original project that started it all.',
  },
  {
    name: 'DeskDesign.com',
    by: 'Colin Vaughn',
    href: 'https://github.com/ColinVaughn/DeskDesign.com',
    note: 'A fork that expanded the original with more models and features (MIT).',
  },
]

const linkClass = 'text-blue-600 hover:underline dark:text-blue-400'

export default function About() {
  return (
    <section className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About DeskSpacing</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          DeskSpacing is a tool for designing and visualizing desk setups in 3D before you buy.
          It&apos;s a modern, ground-up rebuild of the DeskSpacing line — the same idea, rebuilt on a
          current web stack with a cleaner, faster editor and per-instance customization.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Built by</h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          This rebuild is by{' '}
          <a className={linkClass} href="https://github.com/drink970082" target="_blank" rel="noreferrer">
            drink970082
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Inspired by</h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
          This project builds on two earlier open-source projects — full credit to their creators for
          the original concept and design:
        </p>
        <ul className="mt-3 space-y-3">
          {INSPIRATIONS.map((p) => (
            <li key={p.name} className="text-sm text-zinc-600 dark:text-zinc-300">
              <a className={linkClass} href={p.href} target="_blank" rel="noreferrer">
                {p.name}
              </a>{' '}
              — by {p.by}. {p.note}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Built with</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TECH.map((t) => (
            <li
              key={t}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          Most furniture and gear is generated procedurally in code (no downloads), so the catalog
          stays tiny and every item is parametric.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Credits</h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
          The “Accent Chair” model is{' '}
          <a
            className={linkClass}
            href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenChair"
            target="_blank"
            rel="noreferrer"
          >
            SheenChair
          </a>{' '}
          © 2020 Wayfair, LLC, released under{' '}
          <a
            className={linkClass}
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC0 1.0
          </a>
          , via the Khronos glTF Sample Assets. All other models are procedurally generated.
        </p>
      </div>
    </section>
  )
}
