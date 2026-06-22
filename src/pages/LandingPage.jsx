import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import ReactiveGrid from '../components/ReactiveGrid'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

/* ---------- motion helpers ---------- */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const wordsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const wordReveal = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
}

const HEADLINE = [
  { text: 'Engineering' },
  { text: 'the' },
  { text: 'intersection', gradient: true },
  { text: 'of' },
  { text: 'atoms' },
  { text: 'and' },
  { text: 'bits.' },
]

/* ---------- magnetic wrapper ---------- */

function Magnetic({ children, strength = 0.4, bobDelay = 0, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // smooth, weighty follow springs
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.6 })
  const engaged = useRef(false)
  const bobRef = useRef(null)

  // gentle up/down bob on the raw Y until the first hover
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    bobRef.current = animate(y, [0, -11, 0], {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: bobDelay,
    })
    return () => bobRef.current?.stop()
  }, [y, bobDelay])

  const stopBob = () => {
    if (!engaged.current) {
      engaged.current = true
      bobRef.current?.stop()
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onMouseEnter={stopBob}
      onMouseMove={e => {
        stopBob()
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => {
        // hold the offset a beat, then ease back slowly for a weighty release
        const release = { type: 'spring', stiffness: 55, damping: 13, mass: 1.1, delay: 0.14 }
        animate(x, 0, release)
        animate(y, 0, release)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- count-up stat ---------- */

function CountUp({ value, duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const match = String(value).match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : String(value)
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setVal(v),
    })
    return () => controls.stop()
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {Math.round(val)}{suffix}
    </span>
  )
}

/* ---------- portal cards ---------- */

const portalCards = [
  {
    href: '/projects',
    label: 'Projects',
    description: 'AI vision systems, custom keyboards, and more engineering builds.',
    accent: '#30d158',
    bgClass: 'from-emerald-50 to-white dark:from-emerald-950/60 dark:to-zinc-900',
    tags: ['AI Vision', 'PCB Design', 'Robotics'],
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <rect x="8" y="28" width="64" height="44" rx="6" fill="rgba(48,209,88,0.18)" stroke="rgba(48,209,88,0.55)" strokeWidth="1.5" />
        <rect x="18" y="36" width="20" height="18" rx="3" fill="rgba(48,209,88,0.32)" stroke="rgba(48,209,88,0.7)" strokeWidth="1" />
        <rect x="44" y="36" width="20" height="18" rx="3" fill="rgba(48,209,88,0.22)" stroke="rgba(48,209,88,0.6)" strokeWidth="1" />
        <line x1="8" y1="22" x2="72" y2="22" stroke="rgba(48,209,88,0.4)" strokeWidth="1" />
        <circle cx="40" cy="16" r="4" fill="rgba(48,209,88,0.55)" stroke="rgba(48,209,88,0.85)" strokeWidth="1.2" />
        <line x1="40" y1="20" x2="40" y2="28" stroke="rgba(48,209,88,0.55)" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: '/first-journey',
    label: 'FIRST Journey',
    description: '4 seasons of competitive robotics — designing, machining, and competing.',
    accent: '#0071e3',
    bgClass: 'from-blue-50 to-white dark:from-blue-950/60 dark:to-zinc-900',
    tags: ['FTC', 'CNC Machining', 'Java Auton'],
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <rect x="12" y="32" width="56" height="36" rx="5" fill="rgba(0,113,227,0.18)" stroke="rgba(0,113,227,0.55)" strokeWidth="1.5" />
        <rect x="22" y="40" width="36" height="12" rx="2" fill="rgba(0,113,227,0.28)" stroke="rgba(0,113,227,0.65)" strokeWidth="1" />
        <circle cx="29" cy="46" r="4" fill="rgba(0,113,227,0.55)" stroke="rgba(0,113,227,0.85)" strokeWidth="1.2" />
        <circle cx="51" cy="46" r="4" fill="rgba(0,113,227,0.55)" stroke="rgba(0,113,227,0.85)" strokeWidth="1.2" />
        <rect x="20" y="26" width="40" height="8" rx="3" fill="rgba(0,113,227,0.2)" stroke="rgba(0,113,227,0.5)" strokeWidth="1" />
        <path d="M30 14 L40 8 L50 14 L50 26 L30 26 Z" fill="rgba(0,113,227,0.3)" stroke="rgba(0,113,227,0.65)" strokeWidth="1.2" />
      </svg>
    ),
  },
]

function PortalCard({ card, index }) {
  const ref = useRef(null)
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const gx = useSpring(mx, { stiffness: 130, damping: 18 })
  const gy = useSpring(my, { stiffness: 130, damping: 18 })
  const rxV = useMotionValue(0)
  const ryV = useMotionValue(0)
  const rx = useSpring(rxV, { stiffness: 150, damping: 16 })
  const ry = useSpring(ryV, { stiffness: 150, damping: 16 })

  function handleMove(e) {
    const r = ref.current.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    mx.set(px)
    my.set(py)
    rxV.set(-((py / r.height) - 0.5) * 9)
    ryV.set(((px / r.width) - 0.5) * 9)
  }
  function handleLeave() {
    mx.set(-400)
    my.set(-400)
    rxV.set(0)
    ryV.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <Link to={card.href} className="block group" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
          className={`relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-700/60 bg-gradient-to-br ${card.bgClass} p-8 h-72 flex flex-col justify-between transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm dark:shadow-none backdrop-blur-sm`}
        >
          {/* cursor spotlight */}
          <motion.div
            className="absolute w-56 h-56 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              x: gx, y: gy,
              background: `radial-gradient(circle, ${card.accent}22 0%, transparent 70%)`,
            }}
          />
          {/* top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
          />

          <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
            <div className="w-16 h-16 mb-5 opacity-90 transition-transform duration-300 group-hover:scale-105">{card.icon}</div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{card.label}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">{card.description}</p>
          </div>

          <div className="relative z-10 flex items-center justify-between" style={{ transform: 'translateZ(25px)' }}>
            <div className="flex gap-2 flex-wrap">
              {card.tags.map(t => (
                <span key={t} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: card.accent, background: `${card.accent}18`, border: `1px solid ${card.accent}30` }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ background: `${card.accent}20`, color: card.accent }}>
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

const stats = [
  { value: '4', label: 'FTC + FLL Seasons' },
  { value: '4+', label: 'Projects built' },
  { value: '2', label: 'PCBs designed' },
  { value: '94%', label: 'Vision accuracy' },
]

const socials = [
  { icon: GithubIcon, href: 'https://github.com/aaravdhawan25', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/aarav-dhawan-0564693a4', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:aaravdhawan25@gmail.com', label: 'Email' },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* reactive magnetic dot-grid */}
        <ReactiveGrid />

        {/* ambient blur orbs */}
        <motion.div className="absolute top-[-15%] left-[5%] w-[55vw] h-[55vw] max-w-[640px] max-h-[640px] rounded-full bg-[#0071e3]/[0.09] dark:bg-[#0071e3]/[0.07] blur-[120px] pointer-events-none"
          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-[-5%] right-[0%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#7b61ff]/[0.08] dark:bg-[#7b61ff]/[0.07] blur-[100px] pointer-events-none"
          animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-wide uppercase border border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3] mb-8 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#0071e3] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0071e3]" />
              </span>
              Open to collaboration &amp; internships
            </span>
          </motion.div>

          <motion.h1
            variants={wordsContainer}
            className="text-[clamp(2.6rem,8vw,5.8rem)] font-bold tracking-tight leading-[1.04] text-zinc-900 dark:text-zinc-50 mb-6 text-balance"
          >
            {HEADLINE.map((w, i) => (
              <motion.span key={i} variants={wordReveal} className="inline-block mr-[0.22em] last:mr-0">
                {w.gradient ? <span className="gradient-text-animated">{w.text}</span> : w.text}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-[clamp(1rem,2.2vw,1.18rem)] text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8"
          >
            I'm <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Aarav Dhawan</strong> — a high school freshman building competition robots, training vision models, designing PCBs, and pushing what's possible with hardware and AI.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Magnetic bobDelay={0}>
              <Link
                to="/projects"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="group relative h-11 px-7 rounded-full bg-[#0071e3] text-white text-[15px] font-semibold hover:bg-[#0077ed] hover:shadow-[#0071e3]/40 active:scale-[0.96] transition-[transform,background-color,box-shadow] duration-200 flex items-center gap-2 overflow-hidden shadow-lg shadow-[#0071e3]/25 will-change-transform"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative">View projects</span>
                <ArrowRight size={15} className="relative transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Magnetic bobDelay={0.25}>
              <Link
                to="/first-journey"
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="h-11 px-7 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-[15px] font-semibold hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/5 active:scale-[0.96] transition-[transform,border-color,background-color] duration-200 flex items-center backdrop-blur-sm will-change-transform"
              >
                FIRST Journey
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-10 gap-y-6 mb-10">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-2xl sm:text-[1.7rem] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight tabular-nums">
                  <CountUp value={s.value} />
                </span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.92 }}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-150 backdrop-blur-sm"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Explore teaser */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">Explore</span>
            <h2 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Where do you want to go?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portalCards.map((card, i) => (
              <PortalCard key={card.href} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
