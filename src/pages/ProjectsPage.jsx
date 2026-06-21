import { useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { projects } from '../data/projects'
import AIVision from '../components/visuals/AIVision'
import PCBLayers from '../components/visuals/PCBLayers'

const visualMap = {
  'ai-vision': AIVision,
  'pcb-layers': PCBLayers,
}

function useAutoProgress(duration = 12, delay = 0) {
  const progress = useMotionValue(0)
  useEffect(() => {
    let ctrl
    const t = setTimeout(() => {
      ctrl = animate(progress, 1, {
        duration,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 0.8,
      })
    }, delay * 1000)
    return () => {
      clearTimeout(t)
      ctrl?.stop()
    }
  }, [])
  return progress
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

function FeatureItem({ feature, color, index }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex gap-3 py-3.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
    >
      <div className="mt-1 flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">{feature.label}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.detail}</p>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, index, autoProgress }) {
  const isEven = index % 2 === 0
  const Visual = visualMap[project.visualType]

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className="py-20 lg:py-28"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>

          {/* Visual */}
          <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
            <motion.div
              variants={{ hidden: { opacity: 0, x: isEven ? -30 : 30 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)` }} />
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-zinc-900 shadow-2xl">
                {Visual && <Visual progress={autoProgress} />}
              </div>
            </motion.div>
          </div>

          {/* Text */}
          <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col`}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="inline-flex text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: project.color, background: `${project.color}18`, border: `1px solid ${project.color}33` }}>
                {project.category}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{project.year}</span>
            </motion.div>

            <motion.h2 variants={fadeUp}
              className="text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 mb-1">
              {project.title}
            </motion.h2>

            <motion.h3 variants={fadeUp}
              className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold text-zinc-400 dark:text-zinc-500 mb-5">
              {project.subtitle}
            </motion.h3>

            <motion.p variants={fadeUp}
              className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              {project.description}
            </motion.p>

            <div>
              {project.features.map((f, i) => (
                <FeatureItem key={f.label} feature={f} color={project.color} index={i} />
              ))}
            </div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-6">
              {project.tags.map(tag => (
                <span key={tag}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default function ProjectsPage() {
  // Each project gets its own auto-playing progress, staggered
  const p0 = useAutoProgress(10, 0)
  const p1 = useAutoProgress(12, 0.5)
  const progresses = [p0, p1]

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">Projects</span>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hardware meets software.
          </h1>
          <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
            Every project here bridges the physical and digital — designed, built, and coded from scratch.
          </p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-6">
        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          autoProgress={progresses[index] || progresses[0]}
        />
      ))}
    </div>
  )
}
