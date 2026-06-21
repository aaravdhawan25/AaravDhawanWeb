import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skills = [
  { name: 'Java', color: '#f89820', bg: 'rgba(248,152,32,0.12)', desc: 'FTC autonomous routines & PID control' },
  { name: 'Python', color: '#3776ab', bg: 'rgba(55,118,171,0.12)', desc: 'Vision pipelines, scripts & ML' },
  { name: 'React', color: '#61dafb', bg: 'rgba(97,218,251,0.12)', desc: 'Component-driven UIs like this site' },
  { name: 'Tailwind CSS', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', desc: 'Utility-first responsive styling' },
  { name: 'Onshape', color: '#0071e3', bg: 'rgba(0,113,227,0.12)', desc: 'Full parametric CAD assemblies' },
  { name: 'KiCad', color: '#30d158', bg: 'rgba(48,209,88,0.12)', desc: 'Schematic capture & PCB layout' },
  { name: 'OpenCV', color: '#5c3ee8', bg: 'rgba(92,62,232,0.12)', desc: 'Real-time image processing' },
  { name: 'Roboflow', color: '#7b61ff', bg: 'rgba(123,97,255,0.12)', desc: 'Dataset curation & YOLOv8 training' },
  { name: 'QMK', color: '#e34f26', bg: 'rgba(227,79,38,0.12)', desc: 'Custom keyboard firmware layers' },
  { name: 'Arduino', color: '#00979d', bg: 'rgba(0,151,157,0.12)', desc: 'Microcontroller I/O & sensors' },
  { name: 'Raspberry Pi', color: '#c51a4a', bg: 'rgba(197,26,74,0.12)', desc: 'Linux compute for vision & comms' },
  { name: 'YOLOv8', color: '#ffd60a', bg: 'rgba(255,214,10,0.12)', desc: '94% accuracy object detection' },
  { name: 'FTC SDK', color: '#0071e3', bg: 'rgba(0,113,227,0.12)', desc: 'FIRST competition robot software' },
  { name: 'C++', color: '#00599c', bg: 'rgba(0,89,156,0.12)', desc: 'Embedded firmware & performance code' },
  { name: 'Vite', color: '#646cff', bg: 'rgba(100,108,255,0.12)', desc: 'Lightning-fast dev bundler' },
  { name: 'Claude API', color: '#d97757', bg: 'rgba(217,119,87,0.12)', desc: 'LLM integration for AI features' },
]

const row1 = [...skills.slice(0, 8), ...skills.slice(0, 8)]
const row2 = [...skills.slice(8), ...skills.slice(8)]

const proficiencies = [
  { area: 'Mechanical Design', level: 88, color: '#0071e3' },
  { area: 'Embedded Systems', level: 76, color: '#30d158' },
  { area: 'Computer Vision / AI', level: 92, color: '#7b61ff' },
  { area: 'PCB Design', level: 65, color: '#ffd60a' },
  { area: 'Web Development', level: 70, color: '#61dafb' },
]

function Pill({ name, color, bg, desc, reversed }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="relative flex-shrink-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.span
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border cursor-default"
        style={{ color, background: bg, borderColor: `${color}22` }}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        {name}
      </motion.span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: reversed ? 6 : -6, scale: 0.92 }}
            animate={{ opacity: 1, y: reversed ? 10 : -10, scale: 1 }}
            exit={{ opacity: 0, y: reversed ? 6 : -6, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className={`absolute ${reversed ? 'top-full mt-1' : 'bottom-full mb-1'} left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap pointer-events-none`}
            style={{ background: color, color: '#fff', boxShadow: `0 4px 16px ${color}44` }}
          >
            {desc}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${reversed ? '-top-1.5' : '-bottom-1.5'}`}
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                [reversed ? 'borderBottom' : 'borderTop']: `6px solid ${color}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TechStack() {
  return (
    <section id="skills" className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">Skills &amp; Tools</span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My technical toolkit.
          </h2>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">Hover any pill for context.</p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-3 mb-16">
        <div className="flex gap-3 overflow-hidden">
          <motion.div
            className="flex gap-3 flex-shrink-0"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {row1.map((s, i) => <Pill key={i} {...s} />)}
          </motion.div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          <motion.div
            className="flex gap-3 flex-shrink-0"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          >
            {row2.map((s, i) => <Pill key={i} {...s} reversed />)}
          </motion.div>
        </div>
      </div>

      {/* Proficiency bars */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-0.5">Proficiency overview</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Self-assessed relative to a professional engineer.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-2xl">
          {proficiencies.map((p, i) => (
            <motion.div
              key={p.area}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{p.area}</span>
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{p.level}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${p.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
