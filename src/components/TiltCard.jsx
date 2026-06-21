import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export default function TiltCard({ children, className = '', intensity = 14, glare = true, scale = 1.02 }) {
  const ref = useRef(null)
  const xRaw = useMotionValue(0)
  const yRaw = useMotionValue(0)

  const rotateX = useSpring(useTransform(yRaw, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 350, damping: 30 })
  const rotateY = useSpring(useTransform(xRaw, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 350, damping: 30 })
  const glareX = useTransform(xRaw, [-0.5, 0.5], [20, 80])
  const glareY = useTransform(yRaw, [-0.5, 0.5], [20, 80])
  const glareOpacity = useSpring(0, { stiffness: 300, damping: 25 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    xRaw.set((e.clientX - rect.left) / rect.width - 0.5)
    yRaw.set((e.clientY - rect.top) / rect.height - 0.5)
    glareOpacity.set(0.18)
  }

  const handleMouseLeave = () => {
    xRaw.set(0)
    yRaw.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          style={{
            opacity: glareOpacity,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, transparent 65%)`
            ),
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
          className="absolute inset-0"
        />
      )}
    </motion.div>
  )
}
