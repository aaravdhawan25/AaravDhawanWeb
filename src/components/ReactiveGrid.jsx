import { useRef, useEffect } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'

/**
 * Reactive magnetic dot-grid — the magnetic field made visible.
 * A grid of dots gently breathes on its own; as the cursor moves through
 * it the field parts into a glowing bubble, with dots lit in the brand
 * blue→violet gradient. Pairs with the magnetic buttons on the hero.
 */

// brand gradient stops (matches .gradient-text): blue → azure → violet
const STOPS = [
  { s: 0, c: [0, 113, 227] },
  { s: 0.5, c: [48, 160, 255] },
  { s: 1, c: [123, 97, 255] },
]
function gradAt(t) {
  t = t < 0 ? 0 : t > 1 ? 1 : t
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1]
    if (t >= a.s && t <= b.s) {
      const lt = (t - a.s) / (b.s - a.s)
      return [
        (a.c[0] + (b.c[0] - a.c[0]) * lt) | 0,
        (a.c[1] + (b.c[1] - a.c[1]) * lt) | 0,
        (a.c[2] + (b.c[2] - a.c[2]) * lt) | 0,
      ]
    }
  }
  return STOPS[STOPS.length - 1].c
}

export default function ReactiveGrid() {
  const canvasRef = useRef(null)
  const dark = useDarkMode()
  const darkRef = useRef(dark)
  darkRef.current = dark

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let spacing = 42
    let points = []
    let raf
    const start = performance.now()

    const RADIUS = 195
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, inside: false }

    function build() {
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spacing = width < 640 ? 32 : 44
      points = []
      const ox = (width % spacing) / 2
      const oy = (height % spacing) / 2
      for (let y = oy; y <= height + 1; y += spacing) {
        for (let x = ox; x <= width + 1; x += spacing) {
          points.push({ x, y })
        }
      }
    }

    function frame(now) {
      const time = (now - start) / 1000
      // ease the pointer for buttery motion
      mouse.x += (mouse.tx - mouse.x) * 0.16
      mouse.y += (mouse.ty - mouse.y) * 0.16

      ctx.clearRect(0, 0, width, height)
      const isDark = darkRef.current
      const baseRGB = isDark ? '148,163,210' : '71,85,120'
      const baseAlpha = isDark ? 0.22 : 0.26
      const maxPush = spacing * 0.5

      for (let i = 0; i < points.length; i++) {
        const p = points[i]

        // ambient flow — subtle ripple so the field feels alive at rest
        let ax = 0, ay = 0, breathe = 0
        if (!prefersReduced) {
          ax = Math.sin(p.y * 0.018 + time * 0.9) * 1.6
          ay = Math.cos(p.x * 0.018 + time * 0.8) * 1.6
          breathe = (Math.sin((p.x + p.y) * 0.012 + time * 1.4) * 0.5 + 0.5) * 0.5
        }

        let px = p.x + ax
        let py = p.y + ay
        let r = 1 + breathe
        let glow = 0

        const dx = px - mouse.x
        const dy = py - mouse.y
        const dist = Math.hypot(dx, dy)
        if (mouse.inside && dist < RADIUS) {
          const f = 1 - dist / RADIUS          // 0 at edge → 1 at cursor
          const e = f * f
          const inv = 1 / (dist || 1)
          const push = e * maxPush
          px += dx * inv * push
          py += dy * inv * push
          glow = f
          r = 1 + e * 2.6 + breathe
        }

        ctx.beginPath()
        ctx.arc(px, py, r, 0, 6.2832)
        if (glow > 0.012) {
          const [cr, cg, cb] = gradAt(1 - glow) // bright blue near cursor → violet outward
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.3 + glow * 0.7})`
        } else {
          ctx.fillStyle = `rgba(${baseRGB},${baseAlpha * (0.55 + breathe)})`
        }
        ctx.fill()
      }

      // soft additive bloom that trails the cursor
      if (mouse.inside) {
        const halo = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, RADIUS * 1.5)
        const a = isDark ? 0.13 : 0.08
        halo.addColorStop(0, `rgba(64,124,255,${a})`)
        halo.addColorStop(1, 'rgba(64,124,255,0)')
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = halo
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'source-over'
      }

      raf = requestAnimationFrame(frame)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = e.clientX - rect.left
      mouse.ty = e.clientY - rect.top
      if (!mouse.inside) {
        // jump (don't ease) on first entry so it doesn't streak across the field
        mouse.x = mouse.tx
        mouse.y = mouse.ty
      }
      mouse.inside = true
    }
    function onLeave() {
      mouse.inside = false
      mouse.tx = -9999
      mouse.ty = -9999
    }

    build()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', build)
    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}
