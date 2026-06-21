import { useState, useEffect, useRef } from 'react'
import { motion, useTransform, useMotionValueEvent, animate } from 'framer-motion'

const BLUE = '#0071e3'
const GOLD = '#ffd60a'
const METAL = '#b8cfe0'
const GREEN = '#30d158'
const RED = '#ff453a'

// ── Isometric helpers ──────────────────────────────────────────────
const CX = 155, CY = 178, S = 1.55

function iso(x, y, z) {
  return [
    CX + (x - y) * 0.866 * S,
    CY + (x + y) * 0.5 * S - z * S,
  ]
}

function pt(x, y, z) {
  const [px, py] = iso(x, y, z)
  return `${px.toFixed(1)},${py.toFixed(1)}`
}

function polygon(pts) {
  return pts.map(([x, y, z]) => pt(x, y, z)).join(' ')
}

// ── 3D scene geometry ──────────────────────────────────────────────
// Machine table: x:−5..105, y:−5..105, z:−4..0
// Block: x:15..85, y:15..85, z:0..22

// Tool path in 3D (X, Y, Z) — Z=22=cutting depth, Z=32=retracted
const TOOL_PATH_3D = [
  [50, 8, 34],   // 0.00 parked above
  [26, 26, 34],  // 0.08 rapid to corner
  [26, 26, 22],  // 0.20 plunge
  [26, 78, 22],  // 0.346 side 1
  [83, 78, 22],  // 0.504 side 2
  [83, 26, 22],  // 0.650 side 3
  [68, 26, 22],  // 0.692 pocket entry
  [68, 40, 22],  // 0.729 pocket
  [41, 40, 22],  // 0.801 pocket
  [41, 26, 22],  // 0.838 pocket
  [26, 26, 22],  // 0.880 loop back
  [50, 8, 34],   // 0.95 retract
  [50, 8, 34],   // 1.0  home
]

const TOOL_P = [0, 0.08, 0.20, 0.346, 0.504, 0.650, 0.692, 0.729, 0.801, 0.838, 0.880, 0.95, 1.0]
const TOOL_X3 = TOOL_PATH_3D.map(p => p[0])
const TOOL_Y3 = TOOL_PATH_3D.map(p => p[1])
const TOOL_Z3 = TOOL_PATH_3D.map(p => p[2])

const GCODES = [
  { t: 0,    line: 'G28             ; home' },
  { t: 0.05, line: 'G0 X80 Y95 F3000; rapid' },
  { t: 0.12, line: 'G1 Z-2.5 F300   ; plunge' },
  { t: 0.20, line: 'G1 Y215 F800    ; side 1' },
  { t: 0.35, line: 'G1 X210         ; side 2' },
  { t: 0.50, line: 'G1 Y95          ; side 3' },
  { t: 0.65, line: 'G1 X175         ; pocket' },
  { t: 0.73, line: 'G1 Y128         ; pocket' },
  { t: 0.80, line: 'G1 X115         ; pocket' },
  { t: 0.84, line: 'G1 Y95          ; pocket' },
  { t: 0.88, line: 'G0 Z10          ; retract' },
  { t: 0.93, line: 'G28             ; home' },
]

function interpolate(p, times, vals) {
  const xi = times.findIndex(t => t > p)
  const i = Math.max(0, xi < 0 ? times.length - 1 : xi - 1)
  const next = Math.min(times.length - 1, i + 1)
  if (times[next] === times[i]) return vals[i]
  const frac = (p - times[i]) / (times[next] - times[i])
  return vals[i] + (vals[next] - vals[i]) * frac
}

function ReactiveHUD({ progress }) {
  const [state, setState] = useState({ x: 0, y: 0, z: 34, feed: 0, gcode: GCODES[0].line })

  useMotionValueEvent(progress, 'change', v => {
    const tx = interpolate(v, TOOL_P, TOOL_X3)
    const ty = interpolate(v, TOOL_P, TOOL_Y3)
    const tz = interpolate(v, TOOL_P, TOOL_Z3)
    const feed = (v >= 0.2 && v < 0.88) ? 800 : (v >= 0.08 && v < 0.2) ? 3000 : 0
    let gcode = GCODES[0]
    for (const g of GCODES) { if (v >= g.t) gcode = g }
    const xMM = ((tx - 15) / 70 * 80 - 40).toFixed(1)
    const yMM = ((ty - 15) / 70 * 80 - 40).toFixed(1)
    const zMM = (34 - tz).toFixed(1)
    setState({ x: xMM, y: yMM, z: zMM, feed, gcode: gcode.line })
  })

  const px = CX + (310 - 0) * 0.866 * S  // right side for HUD
  const hx = 270

  return (
    <g>
      <rect x={hx} y="50" width="100" height="150" rx="5"
        fill="rgba(6,10,18,0.96)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x={hx+50} y="65" textAnchor="middle" fontSize="6.5" fontFamily="SF Mono, monospace"
        fill="rgba(255,255,255,0.3)" letterSpacing="1">POSITION</text>
      <line x1={hx+6} y1="70" x2={hx+94} y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

      <text x={hx+8} y="83" fontSize="8" fontFamily="SF Mono, monospace" fill={METAL} fontWeight="600">X {state.x >= 0 ? '+' : ''}{state.x}</text>
      <text x={hx+8} y="98" fontSize="8" fontFamily="SF Mono, monospace" fill={METAL} fontWeight="600">Y {state.y >= 0 ? '+' : ''}{state.y}</text>
      <text x={hx+8} y="113" fontSize="8" fontFamily="SF Mono, monospace" fill={GOLD} fontWeight="700">Z {state.z >= 0 ? '+' : ''}{state.z}</text>
      <text x={hx+8} y="128" fontSize="7" fontFamily="SF Mono, monospace" fill={BLUE} opacity="0.9">F {state.feed}</text>

      <line x1={hx+6} y1="134" x2={hx+94} y2="134" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <text x={hx+8} y="145" fontSize="6.5" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.3)">G-CODE</text>
      <text x={hx+8} y="158" fontSize="5.8" fontFamily="SF Mono, monospace" fill={GREEN} opacity="0.9"
        className="break-all">{state.gcode.substring(0, 18)}</text>
      <text x={hx+8} y="172" fontSize="5.8" fontFamily="SF Mono, monospace" fill={GREEN} opacity="0.7">
        {state.gcode.substring(18)}
      </text>

      <line x1={hx+6} y1="180" x2={hx+94} y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <text x={hx+8} y="192" fontSize="6.5" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.3)">SPINDLE</text>
      <text x={hx+8} y="203" fontSize="7.5" fontFamily="SF Mono, monospace" fill={RED} fontWeight="600">
        {state.feed > 0 ? '12,000 RPM' : 'IDLE'}
      </text>
    </g>
  )
}

// Renders the progressive cut trail on the top face of the block
function CutTrail({ progress }) {
  const [trailPts, setTrailPts] = useState([])

  useMotionValueEvent(progress, 'change', v => {
    if (v < 0.2 || v > 0.88) { setTrailPts([]); return }
    // Collect all waypoints up to current progress
    const pts = []
    for (let i = 0; i < TOOL_P.length; i++) {
      if (TOOL_P[i] <= v && TOOL_Z3[i] === 22) {
        pts.push([TOOL_X3[i], TOOL_Y3[i]])
      }
    }
    // Add interpolated current position
    const tx = interpolate(v, TOOL_P, TOOL_X3)
    const ty = interpolate(v, TOOL_P, TOOL_Y3)
    const tz = interpolate(v, TOOL_P, TOOL_Z3)
    if (tz <= 22) pts.push([tx, ty])
    setTrailPts(pts)
  })

  if (trailPts.length < 2) return null

  const d = trailPts.map(([x, y], i) => {
    const [px, py] = iso(x, y, 22)
    return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`
  }).join(' ')

  return (
    <g>
      <path d={d} fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d={d} fill="none" stroke={GOLD} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
    </g>
  )
}

function BlockFaces({ progress }) {
  const [pocketProgress, setPocketProgress] = useState(0)

  useMotionValueEvent(progress, 'change', v => {
    if (v < 0.2) setPocketProgress(0)
    else if (v > 0.88) setPocketProgress(1)
    else setPocketProgress((v - 0.2) / 0.68)
  })

  // Pocket region on the top face (U-bracket shape approximated as a rect + notch)
  // Block top face corners (z=22)
  const topFace = polygon([[15,15,22],[85,15,22],[85,85,22],[15,85,22]])
  // Right face
  const rightFace = polygon([[85,15,0],[85,15,22],[85,85,22],[85,85,0]])
  // Front face
  const frontFace = polygon([[15,85,0],[85,85,0],[85,85,22],[15,85,22]])

  // Pocket (the machined U-bracket area)
  const pocketTopOuter = polygon([[26,26,22],[83,26,22],[83,78,22],[26,78,22]])
  const pocketTopInner = polygon([[41,26,22],[68,26,22],[68,40,22],[41,40,22]])

  // Pocket depth face (bottom of pocket)
  const pocketBottomOuter = polygon([[26,26,18],[83,26,18],[83,78,18],[26,78,18]])

  const po = Math.min(1, pocketProgress * 2)

  return (
    <g>
      {/* Machine bed */}
      <polygon points={polygon([[-6,-6,0],[106,-6,0],[106,106,0],[-6,106,0]])}
        fill="#1a2535" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <polygon points={polygon([[106,-6,-5],[106,-6,0],[106,106,0],[106,106,-5]])}
        fill="#111820" />
      <polygon points={polygon([[-6,106,-5],[106,106,-5],[106,106,0],[-6,106,0]])}
        fill="#0d1320" />

      {/* Grid lines on bed */}
      {Array.from({ length: 6 }, (_, i) => {
        const v = 0 + i * 20
        const [x1, y1] = iso(v, -6, 0.2)
        const [x2, y2] = iso(v, 106, 0.2)
        const [x3, y3] = iso(-6, v, 0.2)
        const [x4, y4] = iso(106, v, 0.2)
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE} strokeWidth="0.3" opacity="0.1" />
            <line x1={x3} y1={y3} x2={x4} y2={y4} stroke={BLUE} strokeWidth="0.3" opacity="0.1" />
          </g>
        )
      })}

      {/* Block right face */}
      <polygon points={rightFace} fill="#7a9ab5" />
      {/* Block front face */}
      <polygon points={frontFace} fill="#6585a0" />

      {/* Block top face */}
      <polygon points={topFace} fill="#b8d4e8" />
      {/* Aluminum grain */}
      {Array.from({ length: 4 }, (_, i) => {
        const y = 25 + i * 18
        const [x1, y1] = iso(15, y, 22.3)
        const [x2, y2] = iso(85, y, 22.3)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      })}

      {/* Machined pocket — U-shape fills as cutting progresses */}
      {po > 0.02 && (
        <>
          {/* Pocket outer area */}
          <polygon points={pocketTopOuter} fill="#1e2d3d" opacity={po * 0.92} />
          {/* Inner bridge (stays as metal) */}
          <polygon points={pocketTopInner} fill="#b8d4e8" opacity={po} />
          {/* Pocket walls (right face of pocket) */}
          {po > 0.3 && (
            <>
              <polygon points={polygon([[83,26,18],[83,26,22],[83,78,22],[83,78,18]])}
                fill="#15222f" opacity={po * 0.8} />
              <polygon points={polygon([[26,78,18],[83,78,18],[83,78,22],[26,78,22]])}
                fill="#111c28" opacity={po * 0.7} />
            </>
          )}
        </>
      )}
    </g>
  )
}

function SpindleAssembly({ progress }) {
  const [toolPos, setToolPos] = useState({ x: 50, y: 8, z: 34 })
  const [glowing, setGlowing] = useState(false)

  useMotionValueEvent(progress, 'change', v => {
    const tx = interpolate(v, TOOL_P, TOOL_X3)
    const ty = interpolate(v, TOOL_P, TOOL_Y3)
    const tz = interpolate(v, TOOL_P, TOOL_Z3)
    setToolPos({ x: tx, y: ty, z: tz })
    setGlowing(v >= 0.2 && v < 0.88)
  })

  const [tipX, tipY] = iso(toolPos.x, toolPos.y, toolPos.z)
  // Spindle shaft goes from gantry height (z=60) straight down to the tool tip
  const [shaftTopX, shaftTopY] = iso(toolPos.x, toolPos.y, 60)
  // Gantry beam: from (toolX, toolY, 60) to crossing the full X range
  const [beam0X, beam0Y] = iso(0, toolPos.y, 60)
  const [beam1X, beam1Y] = iso(100, toolPos.y, 60)
  // Left pillar at x=0
  const [pillarL0X, pillarL0Y] = iso(0, toolPos.y, 0)
  const [pillarL1X, pillarL1Y] = iso(0, toolPos.y, 62)
  // Right pillar at x=100
  const [pillarR0X, pillarR0Y] = iso(100, toolPos.y, 0)
  const [pillarR1X, pillarR1Y] = iso(100, toolPos.y, 62)

  const glowColor = glowing ? GOLD : '#ffffff'
  const glowOpacity = glowing ? 0.9 : 0.3

  return (
    <g>
      {/* Gantry pillars */}
      <line x1={pillarL0X} y1={pillarL0Y} x2={pillarL1X} y2={pillarL1Y}
        stroke="rgba(180,200,220,0.25)" strokeWidth="3" strokeLinecap="round" />
      <line x1={pillarR0X} y1={pillarR0Y} x2={pillarR1X} y2={pillarR1Y}
        stroke="rgba(180,200,220,0.25)" strokeWidth="3" strokeLinecap="round" />

      {/* Gantry beam */}
      <line x1={beam0X} y1={beam0Y} x2={beam1X} y2={beam1Y}
        stroke="rgba(180,200,220,0.35)" strokeWidth="4" strokeLinecap="round" />
      <line x1={beam0X} y1={beam0Y} x2={beam1X} y2={beam1Y}
        stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />

      {/* Spindle shaft */}
      <line x1={shaftTopX} y1={shaftTopY} x2={tipX} y2={tipY}
        stroke="rgba(140,170,200,0.4)" strokeWidth="3" strokeLinecap="round" />
      <line x1={shaftTopX} y1={shaftTopY} x2={tipX} y2={tipY}
        stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Spindle motor housing */}
      <circle cx={shaftTopX} cy={shaftTopY} r="6" fill="rgba(60,80,100,0.9)" stroke="rgba(180,200,220,0.3)" strokeWidth="1" />

      {/* Tool tip glow */}
      {glowing && (
        <>
          <circle cx={tipX} cy={tipY} r="16" fill={GOLD} opacity="0.06" />
          <circle cx={tipX} cy={tipY} r="8" fill={GOLD} opacity="0.12" />
        </>
      )}
      <circle cx={tipX} cy={tipY} r="3.5" fill={glowColor} opacity={glowOpacity} />
      <circle cx={tipX} cy={tipY} r="1.8" fill="white" opacity={glowOpacity} />

      {/* Chips */}
      {glowing && [[-10,-6],[8,-9],[4,10],[-7,8],[12,3],[-12,2]].map(([dx, dy], i) => (
        <circle key={i} cx={tipX + dx} cy={tipY + dy} r="1.5" fill={GOLD} opacity="0.5" />
      ))}
    </g>
  )
}

export default function CNCExploded({ progress }) {
  const [svgX, svgY] = iso(50, 8, 34)

  return (
    <div className="relative w-full h-full bg-[#070c14] rounded-2xl overflow-hidden">
      <svg viewBox="0 0 380 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="cnc3d-bg" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#0d1825" />
            <stop offset="100%" stopColor="#060b12" />
          </radialGradient>
          <filter id="cnc-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="380" height="310" fill="url(#cnc3d-bg)" />

        {/* Title */}
        <text x="134" y="18" textAnchor="middle" fontSize="8.5" fontFamily="SF Mono, monospace"
          fill={BLUE} letterSpacing="2" opacity="0.8">CNC MILL · 3-AXIS</text>

        {/* Block, bed, trail */}
        <BlockFaces progress={progress} />
        <CutTrail progress={progress} />
        <SpindleAssembly progress={progress} />

        {/* Axis labels */}
        {(() => {
          const [ax1, ay1] = iso(110, 0, 0); const [ax2, ay2] = iso(125, 0, 0)
          const [bx1, by1] = iso(0, 110, 0); const [bx2, by2] = iso(0, 125, 0)
          const [cx1, cy1] = iso(0, 0, 0);   const [cx2, cy2] = iso(0, 0, 30)
          return (
            <>
              <line x1={ax1} y1={ay1} x2={ax2} y2={ay2} stroke={BLUE} strokeWidth="1.5" opacity="0.4" />
              <text x={ax2+4} y={ay2+3} fontSize="7" fontFamily="SF Mono, monospace" fill={BLUE} opacity="0.45">X</text>
              <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke={GREEN} strokeWidth="1.5" opacity="0.4" />
              <text x={bx2-8} y={by2+8} fontSize="7" fontFamily="SF Mono, monospace" fill={GREEN} opacity="0.45">Y</text>
              <line x1={cx1} y1={cy1} x2={cx2} y2={cy2} stroke={RED} strokeWidth="1.5" opacity="0.4" />
              <text x={cx2-4} y={cy2-4} fontSize="7" fontFamily="SF Mono, monospace" fill={RED} opacity="0.45">Z</text>
            </>
          )
        })()}

        {/* Material label */}
        {(() => {
          const [lx, ly] = iso(50, 90, 5)
          return (
            <>
              <rect x={lx-50} y={ly-6} width={100} height={14} rx="3" fill="rgba(0,113,227,0.1)" />
              <text x={lx} y={ly+4} textAnchor="middle" fontSize="6.5" fontFamily="SF Mono, monospace"
                fill={BLUE} opacity="0.65">6061-T6 · 70×70×22mm</text>
            </>
          )
        })()}

        {/* HUD panel */}
        <ReactiveHUD progress={progress} />
      </svg>
    </div>
  )
}
