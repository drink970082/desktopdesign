import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Create Your Dream Setup</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
        Design and visualize your desk setup in 3D before you buy. Arrange monitors, keyboards, and
        gear on a virtual desk, then share your battlestation.
      </p>
      <div className="mt-8">
        <Link
          to="/create"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Try the Setup Creator
        </Link>
      </div>
    </section>
  )
}
