import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, X } from 'lucide-react'
import { projects } from '../data/projects'
import { firstJourneyItems } from '../data/firstJourney'

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  {
    label: 'Projects',
    href: '/projects',
    children: projects.map(p => ({ label: p.title + ' · ' + p.subtitle, href: '/projects', color: p.color })),
  },
  {
    label: 'FIRST Journey',
    href: '/first-journey',
    children: firstJourneyItems.map(i => ({ label: i.season, href: '/first-journey', color: i.color })),
  },
  { label: 'Skills', href: '/skills' },
]

/* -------- desktop dropdown -------- */
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

/* -------- desktop nav item -------- */
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
      <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <Link
          to={item.href}
          onClick={scrollTop}
          className={`flex items-center gap-1 text-[13px] font-medium transition-colors duration-150 px-1 py-0.5 ${
            active ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
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
        active ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
      }`}
    >
      {item.label}
    </Link>
  )
}

/* -------- hamburger icon (3 animated lines) -------- */
function HamburgerIcon({ open }) {
  return (
    <span className="flex flex-col justify-center items-center w-5 h-5 gap-[5px]">
      <motion.span
        className="block h-[1.5px] w-5 rounded-full bg-current origin-center"
        animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="block h-[1.5px] w-5 rounded-full bg-current"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="block h-[1.5px] w-5 rounded-full bg-current origin-center"
        animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  )
}

/* -------- mobile menu panel -------- */
function MobileMenu({ open, onClose, dark, setDark }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* panel slides down from top */}
          <motion.div
            key="panel"
            className="fixed top-0 left-0 right-0 z-50 rounded-b-3xl overflow-hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: dark ? 'rgba(9,9,11,0.96)' : 'rgba(248,250,252,0.97)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              borderBottom: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
            }}
          >
            {/* header row */}
            <div className="flex items-center justify-between px-6 h-14">
              <Link to="/" onClick={() => { scrollTop(); onClose() }} className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                aarav<span className="text-[#0071e3]">.</span>dhawan
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* nav links */}
            <nav className="px-4 pb-6 pt-2 flex flex-col gap-1">
              {NAV_ITEMS.map((item, idx) => (
                <MobileNavGroup key={idx} item={item} onClose={onClose} dark={dark} />
              ))}

              {/* divider */}
              <div className="my-3 border-t border-zinc-200 dark:border-zinc-800" />

              {/* theme toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors w-full text-left"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                {dark ? 'Switch to light mode' : 'Switch to dark mode'}
              </button>

              {/* CTA */}
              <button
                onClick={() => {
                  onClose()
                  setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 320)
                }}
                className="mt-2 w-full h-11 rounded-full bg-[#0071e3] text-white text-[15px] font-semibold hover:bg-[#0077ed] transition-colors flex items-center justify-center"
              >
                Get in touch
              </button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* -------- mobile nav group (item + optional children) -------- */
function MobileNavGroup({ item, onClose, dark }) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const active = location.pathname === item.href

  const handleMainTap = () => {
    if (item.children) {
      setExpanded(v => !v)
    } else {
      scrollTop()
      onClose()
    }
  }

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer select-none transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
        onClick={handleMainTap}
      >
        <span className={`text-[15px] font-medium ${active ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-300'}`}>
          {item.label}
        </span>
        {item.children && (
          <motion.svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-400"
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </motion.svg>
        )}
      </div>

      {item.children && (
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="ml-4 pl-3 border-l border-zinc-200 dark:border-zinc-800 mt-0.5 mb-1 flex flex-col gap-0.5">
                {/* parent link first */}
                <Link
                  to={item.href}
                  onClick={() => { scrollTop(); onClose() }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  View all {item.label}
                </Link>
                {item.children.map((child, i) => (
                  <Link
                    key={i}
                    to={child.href}
                    onClick={() => { scrollTop(); onClose() }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: child.color }} />
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

/* -------- main Navbar -------- */
export default function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (href) => location.pathname === href

  return (
    <>
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

          {/* desktop nav — unchanged */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} item={item} active={isActive(item.href)} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* theme toggle — always visible */}
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

            {/* desktop CTA */}
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:inline-flex h-8 px-4 text-[13px] font-medium items-center rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors duration-150 cursor-pointer"
            >
              Get in touch
            </button>

            {/* hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile drawer */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        dark={dark}
        setDark={setDark}
      />
    </>
  )
}
