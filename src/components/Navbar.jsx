import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { projects } from '../data/projects'
import { firstJourneyItems } from '../data/firstJourney'

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  {
    label: 'Projects',
    href: '/projects',
    children: projects.map(p => ({ label: p.title + ' · ' + p.subtitle, href: `/projects/${p.id}`, color: p.color })),
  },
  {
    label: 'FIRST Journey',
    href: '/first-journey',
    children: firstJourneyItems.map(i => ({ label: i.season, href: `/first-journey/${i.slug}`, color: i.color })),
  },
  { label: 'Skills', href: '/skills' },
]

function DropdownMenu({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[240px] rounded-2xl border border-white/10 dark:border-white/[0.07] shadow-2xl overflow-hidden"
      style={{
        background: 'rgba(18,18,20,0.88)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      }}
    >
      <div className="py-1.5">
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.href}
            onClick={scrollTop}
            className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all duration-100"
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-80" style={{ background: item.color }} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

function NavItem({ item, active }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const out = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', out)
    return () => document.removeEventListener('mousedown', out)
  }, [])

  if (item.children) {
    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Link
          to={item.href}
          onClick={scrollTop}
          className={`flex items-center gap-1 text-[13px] font-medium transition-colors duration-150 px-1 py-0.5 ${
            active
              ? 'text-zinc-900 dark:text-zinc-50'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          {item.label}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-40 mt-0.5">
            <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
        <AnimatePresence>
          {open && <DropdownMenu items={item.children} />}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Link
      to={item.href}
      onClick={scrollTop}
      className={`text-[13px] font-medium transition-colors duration-150 ${
        active
          ? 'text-zinc-900 dark:text-zinc-50'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
      }`}
    >
      {item.label}
    </Link>
  )
}

export default function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href) => location.pathname === href

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? dark ? 'rgba(9,9,11,0.72)' : 'rgba(255,255,255,0.72)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled
          ? dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
          : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        <Link to="/" onClick={scrollTop} className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          aarav<span className="text-[#0071e3]">.</span>dhawan
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={dark ? 'moon' : 'sun'}
                initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden md:inline-flex h-8 px-4 text-[13px] font-medium items-center rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors duration-150 cursor-pointer"
          >
            Get in touch
          </button>
        </div>
      </div>
    </motion.header>
  )
}
