import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Design in 3D',
    body: 'Place desks, monitors, keyboards, speakers, chairs and more, then arrange them exactly how you want.',
  },
  {
    title: 'Snap & arrange',
    body: 'Items snap onto the desk and avoid overlapping, so your layout always looks right.',
  },
  {
    title: 'Save & share',
    body: 'Save setups in your browser, share a link to your battlestation, or export a PNG.',
  },
]

export default function Landing() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Create Your Dream Setup</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
          Design and visualize your desk setup in 3D before you buy. Arrange your gear on a virtual
          desk, then save, share, or screenshot your battlestation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/create"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
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
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
