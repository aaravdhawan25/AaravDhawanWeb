import { motion } from 'framer-motion'
import { Cpu, Wrench, Brain, Award } from 'lucide-react'
import TiltCard from './TiltCard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const timeline = [
  { year: ' September 2022', title: 'First Robot Build', desc: 'Assembled my first Competition Lego robot for FLL - sparked a full obsession with mechanical design and programming.', icon: Wrench, color: '#0071e3' },
  { year: 'May 2025', title: 'Rookie at FTC Team 23490', desc: 'Joined FTC Team 23490 as a rookie and exceeded expectations which got me Technical Lead Role as a rookie.  — designing custom CNC-machined aluminum and polycarbonate parts.', icon: Award, color: '#30d158' },
  { year: 'January 2026', title: 'First AI Vision Project', desc: 'Trained a YOLOv8 model via Roboflow and integrated it with a 6-DOF sorting arm, bridging ML and physical hardware.', icon: Brain, color: '#7b61ff' },
  { year: 'June 2026', title: 'PCB & Firmware Design', desc: 'Designed my first two-layer PCB in KiCad, hand-routed traces, assembled SMD components, and flashed QMK firmware.', icon: Cpu, color: '#ffd60a' },
]

const pillars = [
  { title: 'Mechanical Engineering', body: 'Parametric CAD in Onshape, GD&T, and machining — designing parts that translate cleanly from screen to shop floor.', color: '#0071e3' },
  { title: 'Embedded Systems', body: 'From RP2040 to Arduino to Raspberry Pi — writing firmware that reads sensors, drives actuators, and talks to the cloud.', color: '#30d158' },
  { title: 'AI & Computer Vision', body: 'Training and deploying custom vision models for real-world detection tasks using Roboflow, OpenCV, and Python.', color: '#7b61ff' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="mb-12">
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">About me</span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50">
            Builder at the boundary of<br className="hidden sm:block" /> software and steel.
          </h2>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            As a high school freshman, I care about one thing: making physical things that are actually
            smart. I design parts in CAD, machine them in metal, wire up the electronics, and write
            the code that brings the whole system to life.
          </p>
        </motion.div>

        {/* Three pillars with tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <TiltCard className="h-full rounded-2xl">
                <div
                  className="h-full p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200 cursor-default"
                  style={{ borderTop: `2px solid ${p.color}40` }}
                >
                  <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center" style={{ background: `${p.color}18` }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{p.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.body}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp} className="mb-5">
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-zinc-400 dark:text-zinc-500">Timeline</span>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
          <div className="flex flex-col gap-6">
            {timeline.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-5 sm:gap-7"
                >
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center cursor-default"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}
                    >
                      <Icon size={16} style={{ color: item.color }} />
                    </motion.div>
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded"
                        style={{ color: item.color, background: `${item.color}18` }}>
                        {item.year}
                      </span>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
