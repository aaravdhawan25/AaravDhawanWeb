import { useRef, useEffect } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'

/**
 * Interactive particle constellation — the "atoms and bits" field.
 * Nodes drift slowly and connect to nearby neighbours. Near the cursor
 * they brighten, link to the pointer, and gently part around it.
 */
export default function ConstellationField() {
  const canvasRef = useRef(null)
  const dark = useDarkMode()
  const darkRef = useRef(dark)
  darkRef.current = dark

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999, active: false }
    let particles = []
    let width = 0
    let height = 0
    let raf

    const CONNECT_DIST = 132
    const MOUSE_DIST = 190

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function initParticles() {
      const count = Math.min(96, Math.max(28, Math.floor((width * height) / 15000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.6,
      }))
    }

    function resize() {
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    function step() {
      ctx.clearRect(0, 0, width, height)
      const isDark = darkRef.current
      const accent = '0,113,227'
      const dotBase = isDark ? '226,232,240' : '51,65,85'
      const lineAlpha = isDark ? 0.13 : 0.16
      const dotAlpha = isDark ? 0.4 : 0.42

      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx
          p.y += p.vy
        }
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
        p.x = Math.max(0, Math.min(width, p.x))
        p.y = Math.max(0, Math.min(height, p.y))

        let glow = 0
        if (mouse.active) {
          const mdx = p.x - mouse.x
          const mdy = p.y - mouse.y
          const mdist = Math.hypot(mdx, mdy) || 0.001
          if (mdist < MOUSE_DIST) {
            glow = 1 - mdist / MOUSE_DIST
            const force = glow * glow * 0.9
            p.x += (mdx / mdist) * force
            p.y += (mdy / mdist) * force
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(${accent},${glow * 0.55})`
            ctx.lineWidth = glow * 1.1
            ctx.stroke()
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + glow * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = glow > 0.02
          ? `rgba(${accent},${0.45 + glow * 0.55})`
          : `rgba(${dotBase},${dotAlpha})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < CONNECT_DIST) {
            const o = 1 - dist / CONNECT_DIST
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${dotBase},${o * lineAlpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(step)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    function onLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    step()
    window.addEventListener('resize', resize)
    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}
