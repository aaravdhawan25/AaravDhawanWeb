import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, Mail } from 'lucide-react'

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

const stats = [
  { value: '2', label: 'FTC Seasons' },
  { value: '4+', label: 'Projects built' },
  { value: '2', label: 'PCBs designed' },
  { value: '94%', label: 'Vision accuracy' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

function MagneticBtn({ children, className, href }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  return (
    <motion.a
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.a>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const orb1X = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), { stiffness: 60, damping: 20 })
  const orb1Y = useSpring(useTransform(mouseY, [0, 1], [-20, 20]), { stiffness: 60, damping: 20 })
  const orb2X = useSpring(useTransform(mouseX, [0, 1], [20, -20]), { stiffness: 40, damping: 20 })
  const orb2Y = useSpring(useTransform(mouseY, [0, 1], [20, -20]), { stiffness: 40, damping: 20 })

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth)
    mouseY.set(e.clientY / window.innerHeight)
  }

  return (
    <section
      ref={ref}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(128,128,128,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Interactive orbs */}
      <motion.div style={{ x: orb1X, y: orb1Y }}
        className="absolute top-[-15%] left-[8%] w-[55vw] h-[55vw] max-w-[640px] max-h-[640px] rounded-full bg-[#0071e3]/[0.09] dark:bg-[#0071e3]/[0.06] blur-[110px] pointer-events-none" />
      <motion.div style={{ x: orb2X, y: orb2Y }}
        className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#7b61ff]/[0.09] dark:bg-[#7b61ff]/[0.06] blur-[90px] pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium tracking-wide uppercase border border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3] mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
            Open to collaboration &amp; internships
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-[clamp(2.6rem,8vw,5.8rem)] font-bold tracking-tight leading-[1.04] text-zinc-900 dark:text-zinc-50 mb-5 text-balance"
        >
          Engineering the{' '}
          <span className="gradient-text">intersection</span>
          {' '}of atoms and bits.
        </motion.h1>

        {/* Sub */}
        <motion.p variants={fadeUp}
          className="text-[clamp(1rem,2.2vw,1.18rem)] text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8"
        >
          I'm <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Aarav Dhawan</strong> — a high school freshman
          building competition robots, training vision models, designing PCBs, and pushing what's
          possible with mechanical engineering and AI.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <MagneticBtn
            href="#projects"
            className="h-11 px-7 rounded-full bg-[#0071e3] text-white text-[15px] font-semibold hover:bg-[#0077ed] transition-colors duration-150 flex items-center cursor-pointer"
          >
            View my work
          </MagneticBtn>
          <MagneticBtn
            href="#contact"
            className="h-11 px-7 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-[15px] font-semibold hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors duration-150 flex items-center cursor-pointer"
          >
            Say hello
          </MagneticBtn>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-8 mb-10">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{s.value}</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-0.5">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          {[
            { icon: GithubIcon, href: 'https://github.com/aaravdhawan25', label: 'GitHub' },
            { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/aarav-dhawan-0564693a4', label: 'LinkedIn' },
            { icon: Mail, href: 'mailto:aaravdhawan25@gmail.com', label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-150"
            >
              <Icon size={16} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-150"
      >
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={14} />
        </motion.div>
      </motion.a>
    </section>
  )
}
