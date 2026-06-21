import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800/60 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <Link to="/" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            aarav<span className="text-[#0071e3]">.</span>dhawan
          </Link>
          <span className="hidden sm:block text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-600">aaravdhawan.me</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-[12px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors">About</Link>
          <Link to="/projects" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-[12px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors">Projects</Link>
          <Link to="/skills" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-[12px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors">Skills</Link>
          <Link to="/first-journey" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-[12px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors">FIRST Journey</Link>
          <button onClick={() => scrollTo('contact')} className="text-[12px] text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors cursor-pointer">Contact</button>
        </div>

        <p className="text-[11px] text-zinc-300 dark:text-zinc-700 font-mono">
          © {year} Aarav Dhawan
        </p>
      </div>
    </footer>
  )
}
