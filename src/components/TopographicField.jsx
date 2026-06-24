import { useRef, useEffect } from 'react'
import { useDarkMode } from '../hooks/useDarkMode'

/**
 * Reactive topographic contour field — flowing nested "elevation" lines
 * in a violet→blue gradient, inspired by generative topo-map art. The
 * whole field gently drifts, and the contour islands lean + bulge toward
 * the cursor. Sits above the reactive dot-grid, below the hero content.
 */

function lerp(a, b, t) {
  return a + (b - a) * t
}

export default function TopographicField() {
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
    let centers = []
    let raf
    const start = performance.now()

    // eased pointer + activation
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, act: 0, inside: false }

    function build() {
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const minSide = Math.min(width, height)
      const small = width < 760
      // two overlapping topographic "islands", composed on a diagonal
      centers = [
        {
          bx: width * (small ? 0.5 : 0.72),
          by: height * (small ? 0.34 : 0.4),
          maxR: minSide * (small ? 0.6 : 0.52),
          rings: small ? 13 : 18,
          lean: 0.1,
          drift: 9,
          speed: 0.5,
          phase: 0,
        },
        {
          bx: width * (small ? 0.32 : 0.42),
          by: height * (small ? 0.82 : 0.82),
          maxR: minSide * (small ? 0.42 : 0.36),
          rings: small ? 9 : 13,
          lean: 0.16,
          drift: 12,
          speed: 0.7,
          phase: 2.2,
        },
      ]
      mouse.x = width * 0.6
      mouse.y = height * 0.45
      mouse.tx = mouse.x
      mouse.ty = mouse.y
    }

    function frame(now) {
      const time = prefersReduced ? 0 : (now - start) / 1000

      // ease pointer + activation
      mouse.x += (mouse.tx - mouse.x) * 0.07
      mouse.y += (mouse.ty - mouse.y) * 0.07
      mouse.act += ((mouse.inside ? 1 : 0) - mouse.act) * 0.06

      ctx.clearRect(0, 0, width, height)

      const isDark = darkRef.current
      // violet (inner) → blue (outer)
      const inner = isDark ? [190, 150, 255] : [124, 58, 237]
      const outer = isDark ? [70, 140, 255] : [37, 99, 235]
      const alphaScale = isDark ? 1 : 0.66

      ctx.lineJoin = 'round'

      for (let c = 0; c < centers.length; c++) {
        const ct = centers[c]
        // slow drift + lean toward the cursor
        const driftX = Math.sin(time * ct.speed + ct.phase) * ct.drift
        const driftY = Math.cos(time * ct.speed * 0.8 + ct.phase) * ct.drift
        const cx = ct.bx + driftX + (mouse.x - ct.bx) * ct.lean * mouse.act
        const cy = ct.by + driftY + (mouse.y - ct.by) * ct.lean * mouse.act

        const ringGap = ct.maxR / ct.rings
        const amp = ringGap * 0.72
        const angToMouse = Math.atan2(mouse.y - cy, mouse.x - cx)

        const p1 = time * 0.6 + ct.phase
        const p2 = time * 0.45
        const p3 = time * 0.8 + ct.phase * 0.5

        for (let r = 1; r <= ct.rings; r++) {
          const baseR = ringGap * r
          const t = r / ct.rings // 0 inner → 1 outer

          const col = [
            Math.round(lerp(inner[0], outer[0], t)),
            Math.round(lerp(inner[1], outer[1], t)),
            Math.round(lerp(inner[2], outer[2], t)),
          ]
          const a = (0.62 * (1 - t) + 0.18) * alphaScale

          ctx.beginPath()
          const STEPS = width < 760 ? 56 : 80
          for (let s = 0; s <= STEPS; s++) {
            const ang = (s / STEPS) * Math.PI * 2
            // multi-harmonic radial noise — nearly identical per ring so
            // contours stay parallel (no messy crossing)
            let n =
              Math.sin(ang * 3 + p1) * 0.6 +
              Math.sin(ang * 5 - p2) * 0.3 +
              Math.sin(ang * 2 + p3) * 0.5 +
              Math.sin(ang * 7 + p2 + r * 0.35) * 0.12
            n /= 1.52 // → ~[-1, 1]
            // bulge toward the cursor on the facing side
            const bulge = Math.cos(ang - angToMouse) * 0.35 * mouse.act
            const radius = baseR + amp * (n + bulge)
            const px = cx + Math.cos(ang) * radius
            const py = cy + Math.sin(ang) * radius
            if (s === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()

          // soft bloom pass + crisp line
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a * 0.4})`
          ctx.lineWidth = 3.2
          ctx.stroke()
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`
          ctx.lineWidth = 1.2
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(frame)
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = e.clientX - rect.left
      mouse.ty = e.clientY - rect.top
      mouse.inside = true
    }
    function onLeave() {
      mouse.inside = false
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{
        maskImage: 'radial-gradient(ellipse 70% 72% at 50% 46%, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.7) 45%, black 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 72% at 50% 46%, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.7) 45%, black 75%)',
      }}
    />
  )
}
