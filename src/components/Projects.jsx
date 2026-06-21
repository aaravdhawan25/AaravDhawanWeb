import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { projects } from '../data/projects'
import CNCExploded from './visuals/CNCExploded'
import AIVision from './visuals/AIVision'
import PCBLayers from './visuals/PCBLayers'

const visualMap = {
  'cnc-exploded': CNCExploded,
  'ai-vision': AIVision,
  'pcb-layers': PCBLayers,
}

function FeatureReveal({ feature, threshold, progress }) {
  const opacity = useTransform(progress, [threshold, threshold + 0.1], [0, 1])
  const y = useTransform(progress, [threshold, threshold + 0.1], [12, 0])
  return (
    <motion.div style={{ opacity, y }} className="flex gap-3 py-3.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
      <div className="mt-1 flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
        style={{ background: `${feature.color}22`, border: `1px solid ${feature.color}44` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: feature.color }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">{feature.label}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.detail}</p>
      </div>
    </motion.div>
  )
}

function ProjectVisualPanel({ project, scrollYProgress }) {
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 0.12, 0.12, 0])
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  const hoverGlow = useSpring(0, { stiffness: 200, damping: 20 })
  const Visual = visualMap[project.visualType]

  return (
    <div className="relative w-full aspect-square mx-auto">
      <motion.div
        style={{ opacity: glowOpacity, backgroundColor: project.color }}
        className="absolute inset-0 rounded-3xl blur-[60px]"
      />
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-center p-3"
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect()
          mx.set(e.clientX - r.left); my.set(e.clientY - r.top); hoverGlow.set(1)
        }}
        onMouseLeave={() => hoverGlow.set(0)}
      >
        <motion.div
          style={{
            x: sx, y: sy, translateX: '-50%', translateY: '-50%', opacity: hoverGlow,
            background: `radial-gradient(circle 100px, ${project.color}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
          className="absolute w-56 h-56 rounded-full"
        />
        {Visual && <Visual progress={scrollYProgress} />}
      </div>
    </div>
  )
}

function ProjectSection({ project, index }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const isEven = index % 2 === 0
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 0.88, 1], [0, 0.05, 0.05, 0])
  const tagsOpacity = useTransform(scrollYProgress, [0.80, 0.90], [0, 1])

  return (
    <div ref={containerRef} className="relative" style={{ height: '140vh' }}>
      <motion.div
        style={{ opacity: bgOpacity, backgroundColor: project.color }}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14 max-w-6xl mx-auto px-6 lg:px-10 w-full items-center">

          {/* Visual */}
          <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} order-1`}>
            <ProjectVisualPanel project={project} scrollYProgress={scrollYProgress} />
          </div>

          {/* Text — always visible, no fade-in */}
          <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} order-2 flex flex-col`}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: project.color, background: `${project.color}18`, border: `1px solid ${project.color}33` }}>
                  {project.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{project.year}</span>
              </div>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 mb-1">
                {project.title}
              </h2>
              <h3 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold tracking-tight text-zinc-400 dark:text-zinc-500 mb-3">
                {project.subtitle}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                {project.description}
              </p>
            </div>

            <div>
              {project.features.map((f, i) => (
                <FeatureReveal
                  key={f.label}
                  feature={{ ...f, color: project.color }}
                  threshold={0.28 + i * 0.22}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            <motion.div style={{ opacity: tagsOpacity }} className="flex flex-wrap gap-2 mt-4">
              {project.tags.map(tag => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.07, y: -1 }}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="h-0.5 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: project.color, scaleX: scrollYProgress, transformOrigin: 'left' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">Projects</span>
          <h2 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hardware meets software.
          </h2>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
            Scroll through each project — then interact with the visualization.
          </p>
        </motion.div>
      </div>

      {projects.map((project, index) => (
        <ProjectSection key={project.id} project={project} index={index} />
      ))}
    </section>
  )
}
