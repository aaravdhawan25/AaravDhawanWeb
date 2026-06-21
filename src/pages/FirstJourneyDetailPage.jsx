import { useState, useRef } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { firstJourneyItems, superpoweredAwards, masterpieceAwards, submergedAwards, decodeAwards } from '../data/firstJourney'
import RobotParallax from '../components/visuals/RobotParallax'
import { Award, Cpu, Wrench, Zap, X, ChevronRight, Trophy, Star, MapPin, ArrowLeft } from 'lucide-react'

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
  'Programmer & Researcher': {
    summary: 'Split time between hands-on robot work and driving the team\'s Innovation Project research.',
    sections: [
      {
        heading: 'Programming & Mechanical Associate',
        body: 'Wrote and tested robot control code for the FLL robot game missions. Also contributed to mechanical assembly, troubleshooting mechanisms, and tuning the robot ahead of each competition.',
      },
      {
        heading: 'Innovation Project Researcher',
        body: 'Led research into real-world problems for each season — methanol as alternative fuel (SUPERPOWERED), sustainable shoe sole design (MASTERPIECE), and banana blossom as a fish alternative (SUBMERGED). Developed the project narrative, prepared research materials, and presented findings to judges.',
      },
      {
        heading: 'Competition results',
        body: 'Across three FLL seasons, contributed to a 1st Place Innovation Project win, a patent filing, advancement to the Global Innovation Challenge, and a 1st Place at the American Robotics Open Competition (AROC).',
      },
    ],
  },
}

function RolePopup({ role, color, team, season, onClose }) {
  const details = ROLE_DETAILS[role]
  const dark = useDarkMode()
  if (!details) return null
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          key="panel"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden"
          style={{
            background: dark
              ? 'linear-gradient(145deg, #131620 0%, #0d1018 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f4f7fb 100%)',
            border: `1px solid ${color}28`,
            boxShadow: dark
              ? `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 80px ${color}14`
              : `0 24px 48px rgba(0,0,0,0.12), 0 0 0 1px ${color}20, 0 0 60px ${color}10`,
          }}
        >
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="p-8">
            <div className="flex items-start justify-between mb-7">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color }}>Role</span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-1">{role}</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{details.summary}</p>
              </div>
              <button onClick={onClose} className="flex-shrink-0 ml-4 mt-0.5 p-1.5 rounded-full transition-colors text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-5">
              {details.sections.map((s, i) => (
                <div key={i} className="flex gap-3.5">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
                    <ChevronRight size={10} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{s.heading}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-5 border-t border-zinc-200 dark:border-zinc-800/60">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-600 font-mono">{team} · {season}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function StatCard({ stat, color }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function onMove(e) {
    const r = ref.current.getBoundingClientRect()
    setTilt({
      x: -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 7,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      className="flex flex-col items-center px-4 py-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/60 cursor-default"
      style={{
        transform: hovered
          ? `perspective(400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.06)`
          : 'perspective(400px) scale(1)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: hovered
          ? `0 0 0 1.5px ${color}70, 0 8px 28px ${color}28, 0 0 0 4px ${color}10`
          : undefined,
      }}
    >
      <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{stat.value}</span>
      <span className="text-[11px] text-zinc-500 uppercase tracking-widest mt-0.5">{stat.label}</span>
    </div>
  )
}

function AwardCard({ award, color, index }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const dark = useDarkMode()

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
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
        transform: hovered
          ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.03)`
          : 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
        boxShadow: hovered
          ? `0 0 0 1.5px ${color}66, 0 8px 32px ${color}28, 0 0 0 4px ${color}12`
          : dark
            ? `0 0 0 1px ${color}28, 0 2px 8px rgba(0,0,0,0.3)`
            : `0 0 0 1px ${color}30, 0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)`,
        borderRadius: '16px',
        background: hovered
          ? dark
            ? `linear-gradient(135deg, ${color}14 0%, rgba(13,17,28,0.95) 100%)`
            : `linear-gradient(135deg, ${color}12 0%, rgba(255,255,255,0.97) 100%)`
          : dark
            ? 'rgba(13,17,28,0.7)'
            : 'rgba(255,255,255,0.85)',
        padding: '20px',
        cursor: 'default',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}16`, border: `1px solid ${color}30` }}>
          <Trophy size={16} style={{ color }} />
        </div>
        {award.highlight && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: `${color}18`, border: `1px solid ${color}40`, color,
              boxShadow: hovered ? `0 0 12px ${color}30` : 'none',
            }}>
            <Star size={8} fill="currentColor" />
            Highlight
          </div>
        )}
      </div>
      <p className="text-sm font-semibold leading-snug" style={{ color: hovered ? (dark ? '#f0f4ff' : '#111827') : (dark ? '#c8d0e0' : '#374151') }}>
        {award.title}
      </p>
    </motion.div>
  )
}

export default function FirstJourneyDetailPage() {
  const { slug } = useParams()
  const [popupOpen, setPopupOpen] = useState(false)

  const item = firstJourneyItems.find(i => i.slug === slug)
  const hasRolePopup = item && !!ROLE_DETAILS[item.role]

  if (!item) {
    return (
      <div className="pt-32 text-center text-zinc-500">
        <p>Season not found.</p>
        <Link to="/first-journey" className="text-[#0071e3] mt-4 inline-block">← Back to FIRST Journey</Link>
      </div>
    )
  }

  const awardsMap = { superpowered: superpoweredAwards, masterpiece: masterpieceAwards, submerged: submergedAwards, decode: decodeAwards }
  const awards = awardsMap[slug] || []

  return (
    <div className="pt-14">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            to="/first-journey"
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-10"
          >
            <ArrowLeft size={13} />
            FIRST Journey
          </Link>
        </motion.div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pb-8">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,113,227,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className={`grid grid-cols-1 ${item.hasRobot ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-center min-h-[500px]`}>
            <motion.div initial="hidden" animate="show" variants={stagger} className={item.hasRobot ? '' : 'max-w-2xl'}>
              <motion.div variants={fadeUp} className="mb-5">
                <span className="text-[12px] uppercase tracking-[0.15em] font-semibold" style={{ color: item.color }}>
                  FIRST Journey
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp}
                className="text-[clamp(2rem,5vw,3.6rem)] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 mb-2">
                {item.season}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base text-zinc-500 dark:text-zinc-400 mb-5">
                {item.team}
              </motion.p>

              {/* Role badge */}
              <motion.div variants={fadeUp} className="mb-6">
                {hasRolePopup ? (
                  <motion.button
                    onClick={() => setPopupOpen(true)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer"
                    style={{ color: item.color, background: `${item.color}16`, border: `1px solid ${item.color}45` }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${item.color}28`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <span className="text-[13px] font-semibold uppercase tracking-widest">{item.role}</span>
                    <ChevronRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold uppercase tracking-widest"
                    style={{ color: item.color, background: `${item.color}16`, border: `1px solid ${item.color}45` }}>
                    {item.role}
                  </span>
                )}
              </motion.div>

              {/* Highlights */}
              <motion.div variants={stagger}>
                {item.highlights.map((h, i) => {
                  const Icon = ICONS[i % ICONS.length]
                  return (
                    <motion.div key={i} variants={fadeUp}
                      className="flex gap-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
                      <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}>
                        <Icon size={13} style={{ color: item.color }} />
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{h}</p>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mt-6">
                {item.stats.map((s, i) => (
                  <StatCard key={i} stat={s} color={item.color} />
                ))}
              </motion.div>
            </motion.div>

            {/* Robot (FTC only) */}
            {item.hasRobot && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <RobotParallax />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Awards */}
      {awards.length > 0 && (
        <section className="py-16 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <span className="text-[12px] uppercase tracking-[0.15em] font-semibold" style={{ color: item.color }}>
                Competition Results
              </span>
              <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
                Awards &amp; placements.
              </h2>
            </motion.div>

            <div className="space-y-14">
              {awards.map((event, ei) => (
                <div key={ei}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: ei * 0.05 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                      <span>{event.date}</span>
                      <span className="opacity-40">·</span>
                      <MapPin size={10} />
                      <span>{event.location}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">{event.event}</h3>
                    <div className="mt-2 h-px w-full bg-zinc-100 dark:bg-zinc-800/60" />
                  </motion.div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.awards.map((award, ai) => (
                      <AwardCard key={ai} award={award} color={item.color} index={ai + ei * 3} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {popupOpen && <RolePopup role={item.role} color={item.color} team={item.team} season={item.season} onClose={() => setPopupOpen(false)} />}
    </div>
  )
}
