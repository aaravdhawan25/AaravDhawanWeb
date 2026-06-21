import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useMotionValue, animate } from 'framer-motion'
import { projects } from '../data/projects'
import AIVision from '../components/visuals/AIVision'
import PCBLayers from '../components/visuals/PCBLayers'
import { ArrowLeft } from 'lucide-react'

const visualMap = {
  'ai-vision': AIVision,
  'pcb-layers': PCBLayers,
}

function useAutoProgress(duration = 12) {
  const progress = useMotionValue(0)
  useEffect(() => {
    const ctrl = animate(progress, 1, {
      duration,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 0.8,
    })
    return ctrl.stop
  }, [])
  return progress
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

function FeatureItem({ feature, color }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function onMove(e) {
    const r = ref.current.getBoundingClientRect()
    setTilt({
      x: -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 5,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 5,
    })
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      className="flex gap-3 p-4 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 cursor-default"
      style={{
        transform: hovered
          ? `perspective(500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.025)`
          : 'perspective(500px) scale(1)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        boxShadow: hovered
          ? `0 0 0 1.5px ${color}55, 0 6px 24px ${color}20, 0 0 0 4px ${color}0c`
          : undefined,
      }}
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

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  const progress = useAutoProgress(project?.visualType === 'ai-vision' ? 10 : 12)

  if (!project) {
    return (
      <div className="pt-32 text-center text-zinc-500">
        <p>Project not found.</p>
        <Link to="/projects" className="text-[#0071e3] mt-4 inline-block">← Back to Projects</Link>
      </div>
    )
  }

  const Visual = visualMap[project.visualType]

  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/projects"
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-10"
          >
            <ArrowLeft size={13} />
            All Projects
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="max-w-6xl mx-auto px-6 lg:px-10 pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Visual */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)` }} />
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-zinc-900 shadow-2xl">
              {Visual && <Visual progress={progress} />}
            </div>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <span className="inline-flex text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: project.color, background: `${project.color}18`, border: `1px solid ${project.color}33` }}>
                {project.category}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{project.year}</span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 mb-1">
              {project.title}
            </motion.h1>

            <motion.h2 variants={fadeUp}
              className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold text-zinc-400 dark:text-zinc-500 mb-5">
              {project.subtitle}
            </motion.h2>

            <motion.p variants={fadeUp}
              className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              {project.description}
            </motion.p>

            <div>
              {project.features.map((f) => (
                <FeatureItem key={f.label} feature={f} color={project.color} />
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
      </motion.div>
    </div>
  )
}
