import { useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

const TILT  = { stiffness: 200, damping: 32, mass: 0.7 }
const LIGHT = { stiffness: 45,  damping: 16, mass: 1.4 }

export default function RobotParallax() {
  const ref = useRef(null)

  const rotX   = useSpring(0,   TILT)
  const rotY   = useSpring(0,   TILT)
  const lightX = useSpring(100, LIGHT)
  const lightY = useSpring(0,   LIGHT)
  const lift   = useSpring(0,   TILT)
  const cardScale = useTransform(lift, [0, 1], [1, 1.016])

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left)  / rect.width)  * 100
    const py = ((e.clientY - rect.top)   / rect.height) * 100
    rotX.set(-(py / 100 - 0.5) * 10)
    rotY.set( (px / 100 - 0.5) * 10)
    lightX.set(px)
    lightY.set(py)
    lift.set(1)
  }

  function onLeave() {
    rotX.set(0)
    rotY.set(0)
    lightX.set(100)
    lightY.set(0)
    lift.set(0)
  }

  // Spotlight beam: large ellipse sweeping from top-right corner toward mouse
  const spotlightBg = useTransform(
    [lightX, lightY],
    ([lx, ly]) => {
      // midpoint between top-right corner and mouse — the beam center
      const bx = (lx + 100) / 2
      const by = (ly + 0)   / 2
      return [
        // Large warm cone from top-right corner
        `radial-gradient(ellipse 110% 110% at 100% 0%, rgba(255,205,70,0.30) 0%, rgba(255,170,40,0.14) 35%, transparent 65%)`,
        // Directed beam toward mouse
        `radial-gradient(ellipse 72% 68% at ${bx}% ${by}%, rgba(255,195,65,0.32) 0%, rgba(255,160,30,0.14) 42%, transparent 72%)`,
        // Hotspot at mouse
        `radial-gradient(circle 110px at ${lx}% ${ly}%, rgba(255,220,100,0.22) 0%, transparent 65%)`,
        // Lamp glow at top-right corner
        `radial-gradient(circle 55px at 100% 0%, rgba(255,240,160,0.75) 0%, rgba(255,210,80,0.35) 40%, transparent 70%)`,
      ].join(',')
    }
  )

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full aspect-square max-w-[520px] mx-auto select-none"
      style={{ perspective: '900px' }}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden"
        style={{
          rotateX: rotX,
          rotateY: rotY,
          scale: cardScale,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          background: '#0e1018',
          boxShadow: '0 28px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)',
        }}
      >
        {/* Inner white surface so multiply blend has something to work against */}
        <div style={{ position: 'absolute', inset: 0, background: '#ffffff', zIndex: 0 }} />

        {/* Robot — zoom 2.0× centered on full shooter body */}
        <img
          src="/ShooterCad.png"
          alt="FTC Robot — Team 23490 Beta Blink"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: 'scale(2.0)',
            transformOrigin: '50% 56%',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />

        {/* Dark vignette to kill the residual gray bg at edges */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          borderRadius: 'inherit',
          background: 'radial-gradient(ellipse 66% 60% at 50% 56%, transparent 30%, rgba(14,16,24,0.55) 58%, rgba(14,16,24,0.92) 76%, #0e1018 90%)',
          pointerEvents: 'none',
        }} />

        {/* Spotlight — warm amber from top-right, follows mouse */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          borderRadius: 'inherit',
          background: spotlightBg,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }} />

        {/* Tilt specular sheen */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          borderRadius: 'inherit',
          background: useTransform(
            [rotX, rotY],
            ([rx, ry]) =>
              `linear-gradient(${128 - ry * 2.5}deg, rgba(255,255,255,${0.05 + Math.abs(rx + ry) * 0.0015}) 0%, transparent 45%)`
          ),
          pointerEvents: 'none',
        }} />
      </motion.div>
    </div>
  )
}
