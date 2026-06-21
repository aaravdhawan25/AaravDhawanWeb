import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useTransform, AnimatePresence } from 'framer-motion'

const GREEN = '#30d158'
const BLUE = '#0071e3'
const RED = '#ff453a'
const YELLOW = '#ffd60a'
const PURPLE = '#7b61ff'
const CYAN = '#5ac8fa'
const METAL = '#8ea8c0'

const ARM_BASE = { x: 170, y: 312 }
const LINKS = [82, 65, 48] // 3 links = 195px total reach

const detectionDefs = [
  { x: 80, y: 82, w: 68, h: 58, label: 'Red Box', conf: 97, color: RED },
  { x: 197, y: 96, w: 58, h: 72, label: 'Cylinder', conf: 92, color: BLUE },
  { x: 127, y: 177, w: 76, h: 52, label: 'Sphere', conf: 88, color: GREEN },
]

// FABRIK inverse kinematics solver for N links
function fabrik(base, target, links) {
  const n = links.length
  let j = [{ ...base }]
  // initialize joints along a vertical line above base
  let acc = 0
  for (let i = 0; i < n; i++) {
    acc += links[i]
    j.push({ x: base.x, y: base.y - acc })
  }

  for (let iter = 0; iter < 12; iter++) {
    // Forward pass: pull tip to target
    j[n] = { ...target }
    for (let i = n - 1; i >= 0; i--) {
      const dx = j[i].x - j[i + 1].x
      const dy = j[i].y - j[i + 1].y
      const d = Math.sqrt(dx * dx + dy * dy) || 0.001
      const r = links[i] / d
      j[i] = { x: j[i + 1].x + dx * r, y: j[i + 1].y + dy * r }
    }
    // Backward pass: restore base, propagate forward
    j[0] = { ...base }
    for (let i = 0; i < n; i++) {
      const dx = j[i + 1].x - j[i].x
      const dy = j[i + 1].y - j[i].y
      const d = Math.sqrt(dx * dx + dy * dy) || 0.001
      const r = links[i] / d
      j[i + 1] = { x: j[i].x + dx * r, y: j[i].y + dy * r }
    }
  }
  return j // [base, j1, j2, tip]
}

function newTarget() {
  let x, y, attempts = 0
  do {
    const angle = -Math.PI * 0.9 + Math.random() * Math.PI * 0.8
    const r = 45 + Math.random() * 145
    x = ARM_BASE.x + r * Math.cos(angle)
    y = ARM_BASE.y + r * Math.sin(angle)
    attempts++
  } while ((x < 78 || x > 262 || y < 68 || y > 278) && attempts < 30)
  return { x: Math.max(78, Math.min(262, x)), y: Math.max(68, Math.min(278, y)) }
}

function BoundingBox({ det, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.g
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.82 }}
          style={{ transformOrigin: `${det.x + det.w / 2}px ${det.y + det.h / 2}px` }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <rect x={det.x} y={det.y} width={det.w} height={det.h}
            fill="none" stroke={det.color} strokeWidth="1.5" strokeDasharray="5 3" />
          {[[det.x, det.y], [det.x + det.w, det.y], [det.x, det.y + det.h], [det.x + det.w, det.y + det.h]].map(([cx, cy], i) => (
            <g key={i}>
              <line x1={cx - (i % 2 === 0 ? -7 : 7)} y1={cy} x2={cx} y2={cy} stroke={det.color} strokeWidth="2.2" />
              <line x1={cx} y1={cy - (i < 2 ? -7 : 7)} x2={cx} y2={cy} stroke={det.color} strokeWidth="2.2" />
            </g>
          ))}
          <rect x={det.x} y={det.y - 20} width={det.w} height={18} rx="3" fill={det.color} opacity="0.92" />
          <text x={det.x + det.w / 2} y={det.y - 7} textAnchor="middle" fontSize="8.5"
            fontFamily="SF Mono, monospace" fill="white" fontWeight="600">
            {det.label} · {det.conf}%
          </text>
        </motion.g>
      )}
    </AnimatePresence>
  )
}

// Draw a 6-DOF arm: base rotation arc + 3 links
function RobotArm({ joints, hitFlash, gameActive }) {
  const [j0, j1, j2, tip] = joints

  // Angle of first link for base rotation arc
  const baseAngle = Math.atan2(j1.y - j0.y, j1.x - j0.x)

  // Small camera end-effector at tip
  const tipAngle = Math.atan2(tip.y - j2.y, tip.x - j2.x)
  const ef1x = tip.x + 7 * Math.cos(tipAngle + Math.PI / 2)
  const ef1y = tip.y + 7 * Math.sin(tipAngle + Math.PI / 2)
  const ef2x = tip.x + 7 * Math.cos(tipAngle - Math.PI / 2)
  const ef2y = tip.y + 7 * Math.sin(tipAngle - Math.PI / 2)

  return (
    <g>
      {/* Base rotation arc */}
      <circle cx={j0.x} cy={j0.y} r="13" fill="none" stroke={BLUE} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 2" />
      <path
        d={`M ${j0.x + 13 * Math.cos(baseAngle - 0.5)} ${j0.y + 13 * Math.sin(baseAngle - 0.5)} A 13 13 0 0 1 ${j0.x + 13 * Math.cos(baseAngle + 0.5)} ${j0.y + 13 * Math.sin(baseAngle + 0.5)}`}
        stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" fill="none"
      />

      {/* Link 1: shoulder (blue, thick) */}
      <line x1={j0.x} y1={j0.y} x2={j1.x} y2={j1.y} stroke="#0d1526" strokeWidth="9" strokeLinecap="round" />
      <line x1={j0.x} y1={j0.y} x2={j1.x} y2={j1.y} stroke={BLUE} strokeWidth="5.5" strokeLinecap="round" />
      <line x1={j0.x} y1={j0.y} x2={j1.x} y2={j1.y} stroke={METAL} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

      {/* Link 2: forearm (purple, medium) */}
      <line x1={j1.x} y1={j1.y} x2={j2.x} y2={j2.y} stroke="#0d1526" strokeWidth="7" strokeLinecap="round" />
      <line x1={j1.x} y1={j1.y} x2={j2.x} y2={j2.y} stroke={PURPLE} strokeWidth="4" strokeLinecap="round" />

      {/* Link 3: wrist (cyan, thin) */}
      <line x1={j2.x} y1={j2.y} x2={tip.x} y2={tip.y} stroke="#0d1526" strokeWidth="5" strokeLinecap="round" />
      <line x1={j2.x} y1={j2.y} x2={tip.x} y2={tip.y} stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" />

      {/* End effector (camera) */}
      <line x1={ef1x} y1={ef1y} x2={ef2x} y2={ef2y} stroke={CYAN} strokeWidth="2" strokeLinecap="round" />
      <rect
        x={tip.x - 4} y={tip.y - 3} width={8} height={6} rx="1.5"
        fill="#0d1526" stroke={CYAN} strokeWidth="1.2"
        transform={`rotate(${tipAngle * 180 / Math.PI} ${tip.x} ${tip.y})`}
      />

      {/* Joints */}
      <circle cx={j0.x} cy={j0.y} r="8" fill="#0d1117" stroke={BLUE} strokeWidth="2.5" />
      <circle cx={j0.x} cy={j0.y} r="3.5" fill={BLUE} />
      <circle cx={j1.x} cy={j1.y} r="5.5" fill="#0d1117" stroke={PURPLE} strokeWidth="2" />
      <circle cx={j1.x} cy={j1.y} r="2.2" fill={PURPLE} />
      <circle cx={j2.x} cy={j2.y} r="4" fill="#0d1117" stroke={CYAN} strokeWidth="1.5" />
      <circle cx={j2.x} cy={j2.y} r="1.5" fill={CYAN} />

      {/* DOF labels */}
      <text x={j0.x + 10} y={j0.y - 10} fontSize="6" fontFamily="SF Mono, monospace" fill={BLUE} opacity="0.6">J1</text>
      <text x={j1.x + 8} y={j1.y - 8} fontSize="6" fontFamily="SF Mono, monospace" fill={PURPLE} opacity="0.6">J2</text>
      <text x={j2.x + 7} y={j2.y - 7} fontSize="6" fontFamily="SF Mono, monospace" fill={CYAN} opacity="0.6">J3</text>

      {/* Tip flash */}
      <motion.circle cx={tip.x} cy={tip.y} r="6"
        animate={{ fill: hitFlash ? YELLOW : GREEN, r: hitFlash ? 9 : 6 }}
        transition={{ duration: 0.12 }}
        stroke="white" strokeWidth="1.5" />
    </g>
  )
}

export default function AIVision({ progress }) {
  const det0v = useTransform(progress, [0.18, 0.30], [0, 1])
  const det1v = useTransform(progress, [0.38, 0.50], [0, 1])
  const det2v = useTransform(progress, [0.58, 0.70], [0, 1])
  const scanOpacity = useTransform(progress, [0, 0.08, 0.55, 0.65], [0, 0.8, 0.8, 0])
  const scanY = useTransform(progress, [0, 0.5], [60, 280])
  const fpsOpacity = useTransform(progress, [0.08, 0.2], [0, 1])
  const modelOpacity = useTransform(progress, [0.6, 0.78], [0, 1])

  const [scrollDets, setScrollDets] = useState([false, false, false])
  useEffect(() => {
    const uns = [det0v, det1v, det2v].map((mv, i) =>
      mv.on('change', v => setScrollDets(d => { const n = [...d]; n[i] = v > 0.5; return n }))
    )
    return () => uns.forEach(u => u())
  }, [])

  // IK game state
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [target, setTarget] = useState(newTarget)
  const [mouse, setMouse] = useState({ x: 170, y: 180 })
  const [hitFlash, setHitFlash] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const svgRef = useRef(null)
  const timerRef = useRef(null)

  const joints = fabrik(ARM_BASE, mouse, LINKS)
  const tip = joints[joints.length - 1]
  const tipDist = Math.hypot(tip.x - target.x, tip.y - target.y)

  useEffect(() => {
    if (tipDist < 18 && gameActive && !hitFlash) {
      setScore(s => s + 1)
      setTarget(newTarget())
      setHitFlash(true)
      setTimeout(() => setHitFlash(false), 200)
    }
  }, [tipDist, gameActive])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(20)
    setTarget(newTarget())
    setGameOver(false)
  }

  const stopGame = useCallback(() => {
    setGameActive(false)
    setGameOver(true)
    clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (!gameActive) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { stopGame(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [gameActive, stopGame])

  const onMouseMove = useCallback((e) => {
    if (!svgRef.current || !gameActive) return
    const pt = svgRef.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const p = pt.matrixTransform(svgRef.current.getScreenCTM().inverse())
    setMouse({ x: p.x, y: p.y })
  }, [gameActive])

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox="0 0 340 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        onMouseMove={onMouseMove}
        style={{ cursor: gameActive ? 'none' : 'default' }}
      >
        <defs>
          <linearGradient id="aiv-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0" />
            <stop offset="50%" stopColor={GREEN} stopOpacity="0.4" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
          <clipPath id="aiv-clip"><rect x="65" y="55" width="210" height="232" rx="6" /></clipPath>
        </defs>

        {/* Camera frame */}
        <rect x="65" y="55" width="210" height="232" rx="6"
          fill="rgba(0,0,0,0.15)" stroke={GREEN} strokeWidth="1.5" strokeDasharray="6 3" />
        {[[65, 55], [275, 55], [65, 287], [275, 287]].map(([cx, cy], i) => (
          <g key={i}>
            <line x1={cx + (i % 2 === 0 ? 0 : -14)} y1={cy} x2={cx + (i % 2 === 0 ? 14 : 0)} y2={cy} stroke={GREEN} strokeWidth="2.5" />
            <line x1={cx} y1={cy + (i < 2 ? 0 : -14)} x2={cx} y2={cy + (i < 2 ? 14 : 0)} stroke={GREEN} strokeWidth="2.5" />
          </g>
        ))}

        <g clipPath="url(#aiv-clip)">
          <rect x="65" y="55" width="210" height="232" fill="rgba(10,14,20,0.88)" />
          {[0, 1, 2, 3].map(i => <line key={`v${i}`} x1={65 + i * 70} y1="55" x2={65 + i * 70} y2="287" stroke={GREEN} strokeWidth="0.4" opacity="0.12" />)}
          {[0, 1, 2, 3, 4].map(i => <line key={`h${i}`} x1="65" y1={55 + i * 58} x2="275" y2={55 + i * 58} stroke={GREEN} strokeWidth="0.4" opacity="0.12" />)}

          {/* SCAN MODE */}
          {!gameActive && !gameOver && <>
            <rect x="82" y="84" width="64" height="54" rx="4" fill="rgba(255,69,58,0.22)" stroke="rgba(255,69,58,0.35)" strokeWidth="1" />
            <rect x="90" y="92" width="48" height="38" rx="2" fill="rgba(255,69,58,0.1)" />
            <ellipse cx="226" cy="101" rx="27" ry="9" fill="rgba(0,113,227,0.22)" stroke="rgba(0,113,227,0.35)" strokeWidth="1" />
            <rect x="199" y="101" width="54" height="66" fill="rgba(0,113,227,0.12)" stroke="rgba(0,113,227,0.35)" strokeWidth="1" />
            <ellipse cx="226" cy="167" rx="27" ry="9" fill="rgba(0,113,227,0.22)" stroke="rgba(0,113,227,0.35)" strokeWidth="1" />
            <circle cx="165" cy="203" r="32" fill="rgba(48,209,88,0.15)" stroke="rgba(48,209,88,0.3)" strokeWidth="1" />
            <motion.g style={{ opacity: scanOpacity }}>
              <motion.rect style={{ y: scanY }} x="65" y={0} width="210" height="16" fill="url(#aiv-scan)" />
              <motion.line style={{ y: scanY }} x1="65" y1={8} x2="275" y2={8} stroke={GREEN} strokeWidth="1" opacity="0.7" />
            </motion.g>
            {detectionDefs.map((det, i) => <BoundingBox key={i} det={det} visible={scrollDets[i]} />)}
          </>}

          {/* IK GAME */}
          {(gameActive || gameOver) && <>
            <rect x="65" y="55" width="210" height="232" fill="rgba(4,8,14,0.93)" />

            {/* DOF indicator top */}
            <text x="170" y="70" textAnchor="middle" fontSize="7" fontFamily="SF Mono, monospace" fill={PURPLE} letterSpacing="1.5" opacity="0.7">
              6-DOF · INVERSE KINEMATICS
            </text>
            <text x="170" y="79" textAnchor="middle" fontSize="6" fontFamily="SF Mono, monospace" fill={CYAN} opacity="0.5">
              J1:SHOULDER · J2:ELBOW · J3:WRIST
            </text>

            {gameActive && <>
              {/* Target */}
              <AnimatePresence mode="wait">
                <motion.g key={`${target.x.toFixed(0)}-${target.y.toFixed(0)}`}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  style={{ transformOrigin: `${target.x}px ${target.y}px` }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
                  <circle cx={target.x} cy={target.y} r="16" fill="none" stroke={YELLOW} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />
                  <circle cx={target.x} cy={target.y} r="4.5" fill={YELLOW} />
                  <line x1={target.x - 12} y1={target.y} x2={target.x + 12} y2={target.y} stroke={YELLOW} strokeWidth="0.8" opacity="0.4" />
                  <line x1={target.x} y1={target.y - 12} x2={target.x} y2={target.y + 12} stroke={YELLOW} strokeWidth="0.8" opacity="0.4" />
                </motion.g>
              </AnimatePresence>

              {tipDist < 18 && <circle cx={target.x} cy={target.y} r="16" fill={YELLOW} opacity="0.12" />}

              <RobotArm joints={joints} hitFlash={hitFlash} gameActive={gameActive} />

              {/* HUD */}
              <rect x="70" y="58" width="52" height="15" rx="2" fill="rgba(0,0,0,0.78)" />
              <text x="96" y="68.5" textAnchor="middle" fontSize="8" fontFamily="SF Mono, monospace" fill={YELLOW} fontWeight="700">{timeLeft}s</text>
              <rect x="218" y="58" width="54" height="15" rx="2" fill="rgba(0,0,0,0.78)" />
              <text x="245" y="68.5" textAnchor="middle" fontSize="8" fontFamily="SF Mono, monospace" fill={GREEN} fontWeight="700">{score} pts</text>

              {/* Cursor */}
              <circle cx={mouse.x} cy={mouse.y} r="3.5" fill="rgba(255,255,255,0.55)" />
              <line x1={mouse.x - 7} y1={mouse.y} x2={mouse.x + 7} y2={mouse.y} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <line x1={mouse.x} y1={mouse.y - 7} x2={mouse.x} y2={mouse.y + 7} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            </>}

            {gameOver && !gameActive && (
              <g>
                <text x="170" y="148" textAnchor="middle" fontSize="9" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.3)">GAME OVER</text>
                <text x="170" y="178" textAnchor="middle" fontSize="30" fontFamily="SF Mono, monospace" fill={YELLOW} fontWeight="700">{score}</text>
                <text x="170" y="198" textAnchor="middle" fontSize="8" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.35)">targets reached</text>
              </g>
            )}
          </>}
        </g>

        {/* FPS chip */}
        {!gameActive && !gameOver && (
          <motion.g style={{ opacity: fpsOpacity }}>
            <rect x="68" y="58" width="58" height="15" rx="2" fill="rgba(0,0,0,0.75)" />
            <text x="74" y="68.5" fontSize="8" fontFamily="SF Mono, monospace" fill={GREEN} fontWeight="600">30.0 FPS</text>
          </motion.g>
        )}
        {!gameActive && !gameOver && (
          <motion.g style={{ opacity: modelOpacity }}>
            <rect x="185" y="271" width="87" height="15" rx="2" fill="rgba(0,0,0,0.6)" />
            <text x="191" y="281" fontSize="7.5" fontFamily="SF Mono, monospace" fill={BLUE} fontWeight="600">YOLOv8 · Roboflow</text>
          </motion.g>
        )}

        {/* Camera body below SVG viewport */}
        {!gameActive && !gameOver && (
          <g opacity="0.5">
            <rect x="145" y="291" width="50" height="8" rx="2" fill="#3a3a3c" />
            <rect x="163" y="269" width="14" height="26" rx="3" fill="#48484a" />
            <rect x="155" y="253" width="30" height="20" rx="3" fill="#3a3a3c" />
          </g>
        )}
      </svg>

      {/* Game button */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {!gameActive && (
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold font-mono border cursor-pointer"
            style={{ background: `${PURPLE}22`, color: PURPLE, borderColor: `${PURPLE}44` }}
          >
            ⚡ {gameOver ? 'Play Again' : '6-DOF Mini-Game'}
          </motion.button>
        )}
        {gameActive && (
          <motion.button
            onClick={stopGame}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold font-mono border cursor-pointer"
            style={{ background: `${RED}22`, color: RED, borderColor: `${RED}44` }}
          >
            ✕ End
          </motion.button>
        )}
      </div>
    </div>
  )
}
