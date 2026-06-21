import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { firstJourneyItems, ftcProject, decodeAwards } from '../data/firstJourney'
import RobotParallax from '../components/visuals/RobotParallax'
import { Award, Cpu, Wrench, Zap, X, ChevronRight, Trophy, Star, MapPin } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const ICONS = [Award, Wrench, Cpu, Zap]

const ROLE_DETAILS = {
  'Technical Lead': {
    summary: 'Owned the full robot — from the first sketch to the last match.',
    sections: [
      {
        heading: 'Scope of ownership',
        body: 'As Technical Lead I was responsible for every discipline on the robot: programming, CAD, mechanical design, and physical assembly. Nothing shipped without going through me.',
      },
      {
        heading: 'Team leadership',
        body: 'I assigned tasks to teammates based on their strengths and tracked progress against match-day deadlines. When blockers appeared, I re-prioritised work and stepped in where needed to keep the build on schedule.',
      },
      {
        heading: 'Feasibility & execution',
        body: 'Every design decision had to survive a reality check — materials, manufacturing time, and rule compliance. I made those calls and made sure the team had clear, achievable targets rather than open-ended goals.',
      },
    ],
  },
}

function RolePopup({ role, color, onClose }) {
  const details = ROLE_DETAILS[role]
  if (!details) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      >
        {/* Panel */}
        <motion.div
          key="panel"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #131620 0%, #0d1018 100%)',
            border: `1px solid ${color}28`,
            boxShadow: `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 80px ${color}14`,
          }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-7">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color }}>
                  Role
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{role}</h2>
                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">{details.summary}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-4 mt-0.5 p-1.5 rounded-full transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                <X size={15} className="text-zinc-400" />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-5">
              {details.sections.map((s, i) => (
                <div key={i} className="flex gap-3.5">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
                    <ChevronRight size={10} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-200 mb-1">{s.heading}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-7 pt-5 border-t border-zinc-800/60 flex items-center gap-2">
              <span className="text-[11px] text-zinc-600 font-mono">Team 23490 · Beta Blink · FTC 2025–26</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function AwardCard({ award, color, index }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    setTilt({ x: -dy * 8, y: dx * 8 })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        perspective: '600px',
        transform: hovered
          ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)`
          : 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        boxShadow: hovered
          ? `0 0 0 1px ${color}55, 0 8px 32px ${color}22, 0 2px 8px rgba(0,0,0,0.4)`
          : `0 0 0 1px ${color}22, 0 2px 8px rgba(0,0,0,0.2)`,
        borderRadius: '16px',
        background: hovered
          ? `linear-gradient(135deg, ${color}0f 0%, rgba(13,17,28,0.95) 100%)`
          : 'rgba(13,17,28,0.7)',
        padding: '20px',
        cursor: 'default',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top row: trophy + highlight badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}16`, border: `1px solid ${color}30` }}>
          <Trophy size={16} style={{ color }} />
        </div>
        {award.highlight && (
          <motion.div
            animate={{ opacity: hovered ? 1 : 0.75 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}40`,
              color,
              boxShadow: hovered ? `0 0 12px ${color}30` : 'none',
            }}
          >
            <Star size={8} fill="currentColor" />
            Highlight
          </motion.div>
        )}
      </div>

      {/* Award title */}
      <p className="text-sm font-semibold leading-snug"
        style={{ color: hovered ? '#f0f4ff' : '#c8d0e0' }}>
        {award.title}
      </p>
    </motion.div>
  )
}

function AwardsSection() {
  const color = '#0071e3'
  return (
    <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold"
            style={{ color }}>
            Competition Results
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
            Awards &amp; placements.
          </h2>
        </motion.div>

        {/* Events */}
        <div className="space-y-14">
          {decodeAwards.map((event, ei) => (
            <div key={ei}>
              {/* Event meta */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: ei * 0.05 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">
                  <span>{event.date}</span>
                  <span className="opacity-40">·</span>
                  <MapPin size={10} />
                  <span>{event.location}</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
                  {event.event}
                </h3>
                <div className="mt-2 h-px w-full bg-zinc-100 dark:bg-zinc-800/60" />
              </motion.div>

              {/* Award cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.awards.map((award, ai) => (
                  <AwardCard
                    key={ai}
                    award={award}
                    color={color}
                    index={ai + ei * 3}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatBadge({ stat }) {
  return (
    <div className="flex flex-col items-center px-5 py-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
      <span className="text-xl font-bold text-white tracking-tight">{stat.value}</span>
      <span className="text-[11px] text-zinc-500 uppercase tracking-widest mt-0.5">{stat.label}</span>
    </div>
  )
}

function SeasonCard({ item }) {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="py-16"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            {/* Role badge — larger, more visible, clickable */}
            <motion.button
              onClick={() => setPopupOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all"
              style={{
                color: item.color,
                background: `${item.color}16`,
                border: `1px solid ${item.color}45`,
                boxShadow: `0 0 0 0 ${item.color}00`,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${item.color}28`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${item.color}00`}
            >
              <span className="text-[13px] font-semibold uppercase tracking-widest">{item.role}</span>
              <ChevronRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </motion.button>
          </motion.div>

          <motion.h2 variants={fadeUp}
            className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
            {item.season}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-zinc-500 dark:text-zinc-400 mb-8">
            {item.team}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <motion.div variants={stagger}>
              {item.highlights.map((h, i) => {
                const Icon = ICONS[i % ICONS.length]
                return (
                  <motion.div key={i} variants={fadeUp}
                    className="flex gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
                    <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}>
                      <Icon size={13} style={{ color: item.color }} />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{h}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div variants={stagger}>
              <div className="grid grid-cols-2 gap-3">
                {item.stats.map((s, i) => (
                  <motion.div key={i} variants={fadeUp}><StatBadge stat={s} /></motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {popupOpen && (
        <RolePopup role={item.role} color={item.color} onClose={() => setPopupOpen(false)} />
      )}
    </>
  )
}

export default function FirstJourneyPage() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,113,227,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[500px]">
            {/* Text */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} className="mb-5">
                <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">FIRST Journey</span>
              </motion.div>
              <motion.h1 variants={fadeUp}
                className="text-[clamp(2rem,5vw,3.6rem)] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 mb-4">
                One season.<br />One obsession.
              </motion.h1>
              <motion.p variants={fadeUp}
                className="text-base lg:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-md">
                FIRST Tech Challenge is where I learned to design for manufacture, work under real competitive pressure, and build systems that had to perform flawlessly — in front of judges.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {ftcProject.tags.map(tag => (
                  <span key={tag}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Robot parallax */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <RobotParallax />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Season detail */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        {firstJourneyItems.map((item) => (
          <SeasonCard key={item.season} item={item} />
        ))}
      </div>

      {/* Awards */}
      <AwardsSection />
    </div>
  )
}
