import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'

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

const portalCards = [
  {
    href: '/projects',
    label: 'Projects',
    description: 'AI vision systems, custom keyboards, and more engineering builds.',
    accent: '#30d158',
    bg: 'from-emerald-950/40 to-zinc-950',
    tags: ['AI Vision', 'PCB Design', 'Robotics'],
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <rect x="8" y="28" width="64" height="44" rx="6" fill="rgba(48,209,88,0.08)" stroke="rgba(48,209,88,0.2)" strokeWidth="1.5" />
        <rect x="18" y="36" width="20" height="18" rx="3" fill="rgba(48,209,88,0.15)" stroke="rgba(48,209,88,0.4)" strokeWidth="1" />
        <rect x="44" y="36" width="20" height="18" rx="3" fill="rgba(48,209,88,0.1)" stroke="rgba(48,209,88,0.3)" strokeWidth="1" />
        <line x1="8" y1="22" x2="72" y2="22" stroke="rgba(48,209,88,0.15)" strokeWidth="0.8" />
        <circle cx="40" cy="16" r="4" fill="rgba(48,209,88,0.3)" stroke="rgba(48,209,88,0.5)" strokeWidth="1" />
        <line x1="40" y1="20" x2="40" y2="28" stroke="rgba(48,209,88,0.3)" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    href: '/first-journey',
    label: 'FIRST Journey',
    description: '2 seasons of competitive robotics — designing, machining, and competing.',
    accent: '#0071e3',
    bg: 'from-blue-950/40 to-zinc-950',
    tags: ['FTC', 'CNC Machining', 'Java Auton'],
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <rect x="12" y="32" width="56" height="36" rx="5" fill="rgba(0,113,227,0.08)" stroke="rgba(0,113,227,0.2)" strokeWidth="1.5" />
        <rect x="22" y="40" width="36" height="12" rx="2" fill="rgba(0,113,227,0.12)" stroke="rgba(0,113,227,0.35)" strokeWidth="1" />
        <circle cx="29" cy="46" r="4" fill="rgba(0,113,227,0.3)" stroke="rgba(0,113,227,0.5)" strokeWidth="1" />
        <circle cx="51" cy="46" r="4" fill="rgba(0,113,227,0.3)" stroke="rgba(0,113,227,0.5)" strokeWidth="1" />
        <rect x="20" y="26" width="40" height="8" rx="3" fill="rgba(0,113,227,0.1)" stroke="rgba(0,113,227,0.25)" strokeWidth="1" />
        <path d="M30 14 L40 8 L50 14 L50 26 L30 26 Z" fill="rgba(0,113,227,0.15)" stroke="rgba(0,113,227,0.35)" strokeWidth="1" />
      </svg>
    ),
  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

function PortalCard({ card, index }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const gx = useSpring(mx, { stiffness: 120, damping: 18 })
  const gy = useSpring(my, { stiffness: 120, damping: 18 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={card.href} className="block group">
        <div
          className={`relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-gradient-to-br ${card.bg} p-8 h-72 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 hover:shadow-2xl`}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect()
            mx.set(e.clientX - r.left)
            my.set(e.clientY - r.top)
          }}
          onMouseLeave={() => { mx.set(-400); my.set(-400) }}
        >
          <motion.div
            className="absolute w-48 h-48 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              x: gx, y: gy,
              background: `radial-gradient(circle, ${card.accent}14 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            <div className="w-16 h-16 mb-5 opacity-80">{card.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{card.label}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{card.description}</p>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {card.tags.map(t => (
                <span key={t} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: card.accent, background: `${card.accent}18`, border: `1px solid ${card.accent}30` }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ background: `${card.accent}20`, color: card.accent }}>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const stats = [
  { value: '2', label: 'FTC Seasons' },
  { value: '4+', label: 'Projects built' },
  { value: '2', label: 'PCBs designed' },
  { value: '94%', label: 'Vision accuracy' },
]

export default function LandingPage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const orb1X = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const orb1Y = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        onMouseMove={e => {
          mouseX.set(e.clientX / window.innerWidth)
          mouseY.set(e.clientY / window.innerHeight)
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(128,128,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div className="absolute top-[-15%] left-[5%] w-[55vw] h-[55vw] max-w-[640px] max-h-[640px] rounded-full bg-[#0071e3]/[0.07] dark:bg-[#0071e3]/[0.05] blur-[120px] pointer-events-none"
          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-[-5%] right-[0%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#30d158]/[0.06] blur-[90px] pointer-events-none"
          animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium tracking-wide uppercase border border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
              Open to collaboration &amp; internships
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.6rem,8vw,5.8rem)] font-bold tracking-tight leading-[1.04] text-zinc-900 dark:text-zinc-50 mb-6 text-balance"
          >
            Engineering the{' '}
            <span className="gradient-text">intersection</span>
            {' '}of atoms and bits.
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-[clamp(1rem,2.2vw,1.18rem)] text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8"
          >
            I'm <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Aarav Dhawan</strong> — a high school freshman building competition robots, training vision models, designing PCBs, and pushing what's possible with hardware and AI.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              to="/projects"
              className="h-11 px-7 rounded-full bg-[#0071e3] text-white text-[15px] font-semibold hover:bg-[#0077ed] transition-colors duration-150 flex items-center gap-2"
            >
              View projects <ArrowRight size={15} />
            </Link>
            <Link
              to="/first-journey"
              className="h-11 px-7 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-[15px] font-semibold hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-150 flex items-center"
            >
              FIRST Journey
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-10 mb-10">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{s.value}</span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {[
              { icon: GithubIcon, href: 'https://github.com/aaravdhawan25', label: 'GitHub' },
              { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/aarav-dhawan-0564693a4', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:aaravdhawan25@gmail.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.92 }}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-150"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </motion.div>
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
