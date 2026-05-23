import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import Footer from '../ui/Footer'

const features = [
  {
    title: 'Design in 3D',
    body: 'Place desks, monitors, keyboards, speakers, chairs and more, then arrange them exactly how you want.',
  },
  {
    title: 'Customize everything',
    body: 'Resize the desk and your gear, pick any color, and mount monitors on an arm — make it truly yours.',
  },
  {
    title: 'Save & share',
    body: 'Save setups in your browser, share a link to your battlestation, or export a PNG.',
  },
]

export default function Landing() {
  return (
    <div className="flex min-h-full flex-col">
      <section className="relative overflow-hidden">
        {/* aurora gradient backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[42rem] w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-400/30 via-indigo-400/20 to-fuchsia-400/20 blur-3xl dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-fuchsia-500/10" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center sm:pt-20">
          <span className="inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            Design your battlestation in 3D
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Create Your Dream Setup
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            Design and visualize your desk setup in 3D before you buy. Resize and recolor everything,
            then save, share, or screenshot your setup.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/create"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              Open the Setup Creator
            </Link>
            <Link
              to="/about"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Learn more
            </Link>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl dark:border-zinc-800">
            <img src={heroImg} alt="A desk setup designed in DeskSpacing" className="w-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-200 bg-white/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
