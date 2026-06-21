import { useState } from 'react'
import { motion, useTransform, useMotionValueEvent } from 'framer-motion'

// Isometric projection — matches the robot's camera angle (front-right, 30° elevation)
const CX = 192, CY = 200, S = 1.16

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

// Build an iso-projected circle polygon (circle in XY plane at height z)
function isoCircle(r, z, segments = 32) {
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push(pt(r * Math.cos(a), r * Math.sin(a), z))
  }
  return 'M ' + pts.join(' L ') + ' Z'
}

// Side band of circular cylinder (top and bottom circles connected)
function isoCylinderSide(r, zBottom, zTop, segments = 32) {
  // Only render the "visible" half (front-right arc)
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const a = -Math.PI * 0.1 + (i / segments) * Math.PI * 1.2 // front-right visible arc
    pts.push(pt(r * Math.cos(a), r * Math.sin(a), zTop))
  }
  for (let i = segments; i >= 0; i--) {
    const a = -Math.PI * 0.1 + (i / segments) * Math.PI * 1.2
    pts.push(pt(r * Math.cos(a), r * Math.sin(a), zBottom))
  }
  return pts.join(' ')
}

// Spoke wheel — axle along X, face in YZ plane
function SpokeWheel({ x, y, z, r = 28, spokeCount = 5 }) {
  const [cx, cy] = iso(x, y, z)
  // In iso projection: Y axis → screen (−0.866·S, 0.5·S), Z axis → screen (0, −S)
  // Projected Y unit vector in screen: (dy_sx, dy_sy) = (−0.866·S, 0.5·S)
  // Projected Z unit vector in screen: (dz_sx, dz_sy) = (0, −S)
  const dySx = -0.866 * S, dySy = 0.5 * S
  const dzSx = 0, dzSy = -S

  function wheelPt(theta, radius) {
    // theta rotates in YZ plane
    const dy = radius * Math.cos(theta)
    const dz = radius * Math.sin(theta)
    return [
      cx + dy * dySx + dz * dzSx,
      cy + dy * dySy + dz * dzSy,
    ]
  }

  const segments = 40
  const outerRing = Array.from({ length: segments + 1 }, (_, i) => {
    const [px, py] = wheelPt((i / segments) * Math.PI * 2, r)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  const innerRim = Array.from({ length: segments + 1 }, (_, i) => {
    const [px, py] = wheelPt((i / segments) * Math.PI * 2, r * 0.62)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i / spokeCount) * Math.PI * 2 + 0.3
    const [hx, hy] = wheelPt(angle, r * 0.18)
    const [tx, ty] = wheelPt(angle, r * 0.78)
    return { hx, hy, tx, ty }
  })

  const [hubX, hubY] = wheelPt(0, 0)

  // Motor body stub behind wheel (cylinder along X)
  const motorW = r * 0.55
  const motorH = r * 0.42
  const [mx, my] = iso(x + 8, y, z)

  return (
    <g>
      {/* Motor gearbox behind wheel */}
      <ellipse cx={mx} cy={my} rx={motorW * 0.3} ry={motorH * 0.45}
        fill="#2a2a3a" stroke="#3a3a4a" strokeWidth="0.8" />
      {/* Tire */}
      <polygon points={outerRing} fill="#1a1a1e" stroke="#2a2a30" strokeWidth="2" />
      {/* Rim */}
      <polygon points={innerRim} fill="#222228" stroke="#353540" strokeWidth="1" />
      {/* Spokes */}
      {spokes.map((s, i) => (
        <line key={i} x1={s.hx} y1={s.hy} x2={s.tx} y2={s.ty} stroke="#3a3a4a" strokeWidth="1.6" />
      ))}
      {/* Center hub */}
      <circle cx={hubX} cy={hubY} r={4} fill="#505060" stroke="#606070" strokeWidth="0.8" />
      {/* Axle bolt */}
      <circle cx={hubX} cy={hubY} r={1.8} fill="#707080" />
    </g>
  )
}

// Left shooter flywheel — disc viewed slightly from front-left
function FlywheelDisk({ x, y, z, r = 22, spin = 0, color = '#444' }) {
  const [cx, cy] = iso(x, y, z)
  // Flywheel disc — axle along Y axis
  // Y axis projects to: (0.866*S, 0.5*S) in screen
  // Z axis projects to: (0, -S)
  const dxSx = 0.866 * S, dxSy = 0.5 * S
  const dzSx = 0, dzSy = -S

  function diskPt(theta, radius) {
    const dx = radius * Math.cos(theta)
    const dz = radius * Math.sin(theta)
    return [
      cx + dx * dxSx + dz * dzSx,
      cy + dx * dxSy + dz * dzSy,
    ]
  }

  const segs = 32
  const outer = Array.from({ length: segs + 1 }, (_, i) => {
    const [px, py] = diskPt((i / segs) * Math.PI * 2, r)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  const inner = Array.from({ length: segs + 1 }, (_, i) => {
    const [px, py] = diskPt((i / segs) * Math.PI * 2, r * 0.55)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  const spokes = [0, 60, 120, 180, 240, 300].map(deg => {
    const rad = (deg + spin) * Math.PI / 180
    const [hx, hy] = diskPt(rad, r * 0.18)
    const [tx, ty] = diskPt(rad, r * 0.78)
    return { hx, hy, tx, ty }
  })

  const [hubX, hubY] = diskPt(0, 0)

  return (
    <g>
      <polygon points={outer} fill="#252530" stroke={color} strokeWidth="1.5" />
      <polygon points={inner} fill="#1e1e28" stroke="#363642" strokeWidth="0.8" />
      {spokes.map((s, i) => (
        <line key={i} x1={s.hx} y1={s.hy} x2={s.tx} y2={s.ty} stroke={color} strokeWidth="1" opacity="0.7" />
      ))}
      <circle cx={hubX} cy={hubY} r={4.5} fill="#3a3a4a" stroke={color} strokeWidth="0.8" />
      <circle cx={hubX} cy={hubY} r={2} fill={color} />
    </g>
  )
}

// Purple ball with circular holes (wiffle ball style)
function WiffleBall({ cx, cy, r = 36, opacity = 1 }) {
  const PURPLE = '#8b2be2'
  const MID = '#6a1fd0'
  const DARK = '#3d0f80'

  // Hole positions (spherical coords mapped to 2D for display)
  const holes = [
    [0.3, 0.2], [-0.3, 0.2], [0.6, 0.1], [-0.6, 0.1],
    [0.15, 0.55], [-0.15, 0.55], [0.45, 0.5], [-0.45, 0.5],
    [0.0, -0.25], [0.35, -0.15], [-0.35, -0.15],
    [0.25, 0.8], [-0.25, 0.8], [0.0, 0.85],
    [0.6, 0.38], [-0.6, 0.38],
    [0.5, -0.3], [-0.5, -0.3],
  ]

  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="wball" cx="38%" cy="30%">
          <stop offset="0%" stopColor="#c46af0" />
          <stop offset="30%" stopColor={PURPLE} />
          <stop offset="75%" stopColor={MID} />
          <stop offset="100%" stopColor={DARK} />
        </radialGradient>
        <radialGradient id="wball-inner" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#200050" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#100030" stopOpacity="0.6" />
        </radialGradient>
        <clipPath id="wball-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Ball body */}
      <circle cx={cx} cy={cy} r={r} fill="url(#wball)" />
      {/* Holes */}
      {holes.map(([nx, ny], i) => {
        const hx = cx + r * nx * 0.88
        const hy = cy - r * ny * 0.88  // flip y for screen coords
        const hr = r * 0.115 * (1 - Math.abs(nx) * 0.25)
        const depth = Math.sqrt(1 - nx * nx - ny * ny)
        if (depth < 0.15) return null  // skip holes on the far edge
        return (
          <ellipse key={i} cx={hx} cy={hy} rx={hr} ry={hr * 0.88}
            fill="url(#wball-inner)"
            stroke="#1a0040" strokeWidth="0.6"
            clipPath="url(#wball-clip)" />
        )
      })}
      {/* Specular highlight */}
      <ellipse cx={cx - r * 0.32} cy={cy - r * 0.32} rx={r * 0.2} ry={r * 0.12}
        fill="white" opacity="0.22" />
      <ellipse cx={cx - r * 0.18} cy={cy - r * 0.24} rx={r * 0.08} ry={r * 0.05}
        fill="white" opacity="0.45" />
    </g>
  )
}

export default function ShooterAssembly({ progress }) {
  const [spin, setSpin] = useState(0)
  useMotionValueEvent(progress, 'change', v => {
    if (v > 0.48) setSpin(s => (s + 4.5) % 360)
  })

  // Animation thresholds
  const shadowOp = useTransform(progress, [0, 0.08], [0, 1])
  const chassisOp = useTransform(progress, [0.04, 0.18], [0, 1])
  const chassisY  = useTransform(progress, [0.04, 0.20], [22, 0])
  const wheel1Op  = useTransform(progress, [0.16, 0.30], [0, 1])
  const wheel1X   = useTransform(progress, [0.16, 0.30], [30, 0])
  const wheel2Op  = useTransform(progress, [0.20, 0.34], [0, 1])
  const wheel2X   = useTransform(progress, [0.20, 0.34], [30, 0])
  const flyOp     = useTransform(progress, [0.30, 0.46], [0, 1])
  const flyX      = useTransform(progress, [0.30, 0.46], [-28, 0])
  const motorOp   = useTransform(progress, [0.35, 0.50], [0, 1])
  const backstopOp= useTransform(progress, [0.44, 0.58], [0, 1])
  const backstopY = useTransform(progress, [0.44, 0.58], [-30, 0])
  const camOp     = useTransform(progress, [0.55, 0.68], [0, 1])
  const camX      = useTransform(progress, [0.55, 0.68], [25, 0])
  const ballOp    = useTransform(progress, [0.68, 0.82], [0, 1])
  const ballXoff  = useTransform(progress, [0.68, 0.86], [-90, 0])

  // Chassis positions
  const chassisR = 62   // circular chassis radius
  const chassisZ = 7    // chassis thickness

  // Chassis top/bottom iso paths
  const chassisTop    = isoCircle(chassisR, chassisZ)
  const chassisBottom = isoCircle(chassisR, 0)
  const chassisSide   = isoCylinderSide(chassisR, 0, chassisZ)

  // Inner chassis plate details
  const innerRailTop = isoCircle(chassisR * 0.55, chassisZ + 0.5)

  // Camera position (upper right)
  const [camCx, camCy] = iso(42, -42, 40)

  // Backstop triangle (three corners in iso)
  const bsBase1 = iso(-18, -58, chassisZ)
  const bsBase2 = iso(18, -58, chassisZ)
  const bsApex  = iso(0, -48, 55)

  return (
    <div className="w-full h-full bg-[#060c14]">
      <svg viewBox="0 0 376 306" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

        {/* Ground glow */}
        <motion.ellipse
          cx={iso(0, 0, -2)[0]} cy={iso(0, 0, -2)[1]}
          rx={115} ry={32}
          fill="rgba(0,113,227,0.10)"
          style={{ opacity: shadowOp }}
        />

        {/* ── CHASSIS ─────────────────────────────────────────────── */}
        <motion.g style={{ opacity: chassisOp, y: chassisY }}>
          {/* Side band (visible arc) */}
          <polygon points={chassisSide} fill="#252535" stroke="#2a2a40" strokeWidth="0.8" />
          {/* Bottom face */}
          <path d={chassisBottom} fill="#1e1e2e" />
          {/* Top face */}
          <path d={chassisTop} fill="#2e2e42" stroke="#3a3a52" strokeWidth="0.8" />
          {/* Inner rail ring */}
          <path d={innerRailTop} fill="none" stroke="#3a3a52" strokeWidth="0.6" strokeDasharray="3 2" />
          {/* Mounting holes */}
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const rad = deg * Math.PI / 180
            const [hx, hy] = iso(chassisR * 0.82 * Math.cos(rad), chassisR * 0.82 * Math.sin(rad), chassisZ + 0.5)
            return <circle key={i} cx={hx} cy={hy} r={2.5} fill="#1a1a28" stroke="#404055" strokeWidth="0.7" />
          })}
          {/* Center screw */}
          {(() => {
            const [cx, cy] = iso(0, 0, chassisZ + 0.5)
            return <circle cx={cx} cy={cy} r={3} fill="#1a1a28" stroke="#505065" strokeWidth="0.8" />
          })()}
          {/* Chassis label */}
          {(() => {
            const [lx, ly] = iso(0, 18, chassisZ + 1)
            return (
              <text x={lx} y={ly} textAnchor="middle" fontSize="5.5" fontFamily="SF Mono, monospace"
                fill="#404058" letterSpacing="1.5" opacity="0.7">BETA BLINK</text>
            )
          })()}
        </motion.g>

        {/* ── RIGHT WHEEL 1 (back) ───────────────────────────────── */}
        <motion.g style={{ opacity: wheel1Op, x: wheel1X }}>
          {/* Axle */}
          {(() => {
            const [ax1, ay1] = iso(55, 28, 20)
            const [ax2, ay2] = iso(68, 28, 20)
            return <line x1={ax1} y1={ay1} x2={ax2} y2={ay2} stroke="#404050" strokeWidth="2" />
          })()}
          <SpokeWheel x={68} y={28} z={20} r={24} />
          {/* Motor housing */}
          {(() => {
            const [mx, my] = iso(55, 28, 20)
            return (
              <g>
                <ellipse cx={mx} cy={my} rx={11} ry={17}
                  fill="#2a2a3a" stroke="#383848" strokeWidth="1" />
                <ellipse cx={mx} cy={my} rx={5} ry={7.5}
                  fill="#1e1e2e" stroke="#303040" strokeWidth="0.6" />
              </g>
            )
          })()}
        </motion.g>

        {/* ── RIGHT WHEEL 2 (front) ─────────────────────────────── */}
        <motion.g style={{ opacity: wheel2Op, x: wheel2X }}>
          {(() => {
            const [ax1, ay1] = iso(55, -28, 20)
            const [ax2, ay2] = iso(68, -28, 20)
            return <line x1={ax1} y1={ay1} x2={ax2} y2={ay2} stroke="#404050" strokeWidth="2" />
          })()}
          <SpokeWheel x={68} y={-28} z={20} r={24} />
          {(() => {
            const [mx, my] = iso(55, -28, 20)
            return (
              <g>
                <ellipse cx={mx} cy={my} rx={11} ry={17}
                  fill="#2a2a3a" stroke="#383848" strokeWidth="1" />
                <ellipse cx={mx} cy={my} rx={5} ry={7.5}
                  fill="#1e1e2e" stroke="#303040" strokeWidth="0.6" />
              </g>
            )
          })()}
        </motion.g>

        {/* ── LEFT FLYWHEEL SHOOTER ─────────────────────────────── */}
        <motion.g style={{ opacity: flyOp, x: flyX }}>
          {/* Outer structure / casing */}
          {(() => {
            const [sx, sy] = iso(-44, 0, 22)
            return (
              <g>
                {/* Mounting arm */}
                <line
                  x1={iso(-22, -12, 10)[0]} y1={iso(-22, -12, 10)[1]}
                  x2={iso(-44, 0, 22)[0]} y2={iso(-44, 0, 22)[1]}
                  stroke="#303040" strokeWidth="3" />
                {/* Casing ring */}
                <ellipse cx={sx} cy={sy} rx={28} ry={22}
                  fill="#1e1e2c" stroke="#2e2e3e" strokeWidth="1.2" />
                <ellipse cx={sx} cy={sy} rx={22} ry={17}
                  fill="#252535" stroke="#303045" strokeWidth="0.8" />
              </g>
            )
          })()}
          {/* Main flywheel disk */}
          <FlywheelDisk x={-44} y={0} z={22} r={18} spin={spin} color="#0071e3" />
          {/* Motor body above flywheel */}
          {(() => {
            const [mx, my] = iso(-42, 0, 42)
            return (
              <g>
                <ellipse cx={mx} cy={my} rx={9} ry={14}
                  fill="#1e1e2c" stroke="#2e2e3e" strokeWidth="1" />
                <ellipse cx={mx} cy={my} rx={5} ry={7.5}
                  fill="#282838" stroke="#383848" strokeWidth="0.6" />
                {/* Motor shaft */}
                <line x1={mx} y1={my} x2={iso(-44, 0, 22)[0]} y2={iso(-44, 0, 22)[1]}
                  stroke="#404050" strokeWidth="1.5" />
              </g>
            )
          })()}
        </motion.g>

        {/* ── MOTOR CABLE DETAILS ───────────────────────────────── */}
        <motion.g style={{ opacity: motorOp }}>
          {/* Wires from motor */}
          {(() => {
            const [mx, my] = iso(-42, 0, 44)
            const [ex, ey] = iso(-20, -15, 10)
            return (
              <>
                <path d={`M ${mx} ${my} Q ${mx + 10} ${(my + ey) / 2} ${ex} ${ey}`}
                  stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.7" />
                <path d={`M ${mx} ${my + 2} Q ${mx + 12} ${(my + ey) / 2 + 3} ${ex} ${ey + 3}`}
                  stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.7" />
                <path d={`M ${mx} ${my + 4} Q ${mx + 8} ${(my + ey) / 2 + 5} ${ex} ${ey + 5}`}
                  stroke="#e5e5e5" strokeWidth="1" fill="none" opacity="0.5" />
              </>
            )
          })()}
        </motion.g>

        {/* ── TRANSPARENT BACKSTOP ──────────────────────────────── */}
        <motion.g style={{ opacity: backstopOp, y: backstopY }}>
          <polygon
            points={`${bsBase1[0].toFixed(1)},${bsBase1[1].toFixed(1)} ${bsBase2[0].toFixed(1)},${bsBase2[1].toFixed(1)} ${bsApex[0].toFixed(1)},${bsApex[1].toFixed(1)}`}
            fill="rgba(180,210,255,0.06)"
            stroke="rgba(150,180,240,0.3)"
            strokeWidth="1"
          />
          {/* Side edge reinforcement */}
          <line
            x1={bsBase1[0]} y1={bsBase1[1]} x2={bsApex[0]} y2={bsApex[1]}
            stroke="rgba(150,180,240,0.2)" strokeWidth="1.5" />
          <line
            x1={bsBase2[0]} y1={bsBase2[1]} x2={bsApex[0]} y2={bsApex[1]}
            stroke="rgba(150,180,240,0.2)" strokeWidth="1.5" />
        </motion.g>

        {/* ── CAMERA / SENSOR MODULE ────────────────────────────── */}
        <motion.g style={{ opacity: camOp, x: camX }}>
          {/* Camera body */}
          <rect x={camCx - 10} y={camCy - 8} width={20} height={14} rx="2"
            fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
          {/* Lens ring */}
          <circle cx={camCx - 1} cy={camCy - 1} r={5}
            fill="#0a0a0a" stroke="#333" strokeWidth="0.8" />
          <circle cx={camCx - 1} cy={camCy - 1} r={3}
            fill="#0d1a2a" stroke="#0071e3" strokeWidth="0.5" opacity="0.8" />
          {/* Indicator LED */}
          <circle cx={camCx + 6} cy={camCy - 4} r={1.5} fill="#22c55e" opacity="0.9" />
          {/* Mount bracket */}
          {(() => {
            const [bx, by] = iso(38, -38, 25)
            return (
              <line x1={camCx} y1={camCy + 6} x2={bx} y2={by}
                stroke="#2a2a2a" strokeWidth="2" />
            )
          })()}
          {/* Camera wires */}
          {(() => {
            const [wx, wy] = iso(28, -30, 12)
            return (
              <>
                <path d={`M ${camCx + 8} ${camCy} Q ${camCx + 20} ${camCy + 10} ${wx} ${wy}`}
                  stroke="#ef4444" strokeWidth="0.9" fill="none" opacity="0.8" />
                <path d={`M ${camCx + 8} ${camCy + 2} Q ${camCx + 18} ${camCy + 12} ${wx} ${wy + 2}`}
                  stroke="#22c55e" strokeWidth="0.9" fill="none" opacity="0.8" />
                <path d={`M ${camCx + 8} ${camCy + 4} Q ${camCx + 16} ${camCy + 14} ${wx} ${wy + 4}`}
                  stroke="#e5e5e5" strokeWidth="0.9" fill="none" opacity="0.6" />
                <path d={`M ${camCx + 8} ${camCy + 6} Q ${camCx + 14} ${camCy + 16} ${wx} ${wy + 6}`}
                  stroke="#3b82f6" strokeWidth="0.9" fill="none" opacity="0.7" />
              </>
            )
          })()}
        </motion.g>

        {/* ── PURPLE BALL ───────────────────────────────────────── */}
        <motion.g style={{ opacity: ballOp, x: ballXoff }}>
          {(() => {
            const [bx, by] = iso(-2, -8, 42)
            return <WiffleBall cx={bx} cy={by} r={34} />
          })()}
        </motion.g>

        {/* ── HUD OVERLAY ───────────────────────────────────────── */}
        <motion.g style={{ opacity: camOp }}>
          <rect x="12" y="12" width="108" height="46" rx="5"
            fill="rgba(6,12,20,0.88)" stroke="rgba(0,113,227,0.3)" strokeWidth="0.8" />
          <text x="19" y="25" fontSize="6.5" fontFamily="SF Mono, monospace" fill="#0071e3" fontWeight="600" letterSpacing="0.5">FTC 2025–26 · DECODE</text>
          <text x="19" y="36" fontSize="5.8" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.5)">Team 23490 — Beta Blink</text>
          <text x="19" y="47" fontSize="5.5" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.3)">Flywheel shooter · CNC chassis</text>
        </motion.g>
      </svg>
    </div>
  )
}
