import { Link } from 'react-router-dom'

const link = 'underline-offset-2 hover:underline'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <p>
        A modern rebuild of DeskSpacing by{' '}
        <a
          className={link}
          href="https://github.com/cooperlappenbusch/DeskSpacing.com"
          target="_blank"
          rel="noreferrer"
        >
          Cooper Lappenbusch
        </a>{' '}
        &amp;{' '}
        <a
          className={link}
          href="https://github.com/ColinVaughn/DeskDesign.com"
          target="_blank"
          rel="noreferrer"
        >
          Colin Vaughn
        </a>
        .
      </p>
      <p className="mt-1">
        Built by{' '}
        <a className={link} href="https://github.com/drink970082" target="_blank" rel="noreferrer">
          drink970082
        </a>{' '}
        ·{' '}
        <Link className={link} to="/about">
          About
        </Link>
      </p>
    </footer>
  )
}
