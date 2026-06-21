import { motion } from 'framer-motion'
import About from '../components/About'

export default function AboutPage() {
  return (
    <div className="pt-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-4"
      >
        <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0071e3]">About</span>
        <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Who I am.
        </h1>
      </motion.div>
      <About />
    </div>
  )
}
