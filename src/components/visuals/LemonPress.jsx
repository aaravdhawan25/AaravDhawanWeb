import { useState, useRef } from 'react'
import { motion, useTransform, useMotionValue, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion'

const STEEL = '#8ea8c0'
const STEEL_DARK = '#4a6a85'
const STEEL_LIGHT = '#c2d6e8'
const YELLOW = '#ffd60a'
const YELLOW_DARK = '#b8a020'
const GREEN = '#30d158'

function ReactiveText({ mv, format, ...props }) {
  const [display, setDisplay] = useState(format(mv.get()))
  useMotionValueEvent(mv, 'change', v => setDisplay(format(v)))
  return <text {...props}>{display}</text>
}

export default function LemonPress({ progress }) {
  const [pressing, setPressing] = useState(false)
  const [juiced, setJuiced] = useState(false)
  const clickTravel = useSpring(0, { stiffness: 80, damping: 18 })
  const [pressCount, setPressCount] = useState(0)

  const startPress = () => {
    setPressing(true)
    clickTravel.set(1)
  }

  const endPress = () => {
    setPressing(false)
    clickTravel.set(0)
    setPressCount(c => c + 1)
    if (!juiced) setTimeout(() => setJuiced(true), 300)
  }

  const reset = () => {
    setJuiced(false)
    setPressCount(0)
    clickTravel.set(0)
  }

  const scrollT = useTransform(progress, [0.05, 0.82], [0, 1])
  const effectiveT = useSpring(
    useTransform([scrollT, clickTravel], ([s, c]) => Math.max(s, c)),
    { stiffness: 100, damping: 18 }
  )

  const rodH = useTransform(effectiveT, [0, 1], [18, 72])
  const plateY = useTransform(effectiveT, [0, 1], [0, 54])
  const lemonScaleY = useTransform(effectiveT, [0, 1], [1, 0.46])
  const lemonScaleX = useTransform(effectiveT, [0, 1], [1, 1.44])
  const juiceOpacity = useTransform(effectiveT, [0.5, 0.82], [0, 1])
  const juiceY = useTransform(effectiveT, [0.55, 1], [0, 10])
  const forceN = useTransform(effectiveT, [0, 1], [0, 186])
  const forceBarW = useTransform(effectiveT, [0, 1], [0, 46])
  const pwmDuty = useTransform(effectiveT, [0, 1], [0, 80])
  const ledFill = useTransform(effectiveT, [0, 0.85, 1], [GREEN, GREEN, '#ff453a'])

  return (
    <div className="relative w-full h-full select-none">
      <svg viewBox="0 0 340 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="lp-frame2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={STEEL_LIGHT} />
            <stop offset="100%" stopColor={STEEL_DARK} />
          </linearGradient>
          <linearGradient id="lemon-grad2" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#fff176" />
            <stop offset="60%" stopColor={YELLOW} />
            <stop offset="100%" stopColor={YELLOW_DARK} />
          </linearGradient>
          <filter id="lp-shadow2" x="-15%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        <text x="170" y="24" textAnchor="middle" fontSize="9" fontFamily="SF Mono, monospace" fill={YELLOW} letterSpacing="2" opacity="0.85">
          12V LINEAR ACTUATOR PRESS
        </text>

        {/* Frame */}
        <rect x="105" y="65" width="12" height="200" rx="3" fill="url(#lp-frame2)" filter="url(#lp-shadow2)" />
        <rect x="223" y="65" width="12" height="200" rx="3" fill="url(#lp-frame2)" filter="url(#lp-shadow2)" />
        <rect x="100" y="62" width="140" height="14" rx="3" fill="url(#lp-frame2)" filter="url(#lp-shadow2)" />
        <rect x="95" y="258" width="150" height="14" rx="3" fill="url(#lp-frame2)" />
        <rect x="98" y="268" width="30" height="6" rx="2" fill={STEEL_DARK} />
        <rect x="212" y="268" width="30" height="6" rx="2" fill={STEEL_DARK} />

        {/* Actuator body */}
        <rect x="148" y="68" width="44" height="40" rx="4" fill={STEEL_DARK} filter="url(#lp-shadow2)" />
        <rect x="152" y="70" width="32" height="12" rx="2" fill={STEEL} opacity="0.6" />
        <path d="M 148 85 Q 130 90 125 75" stroke="#ff453a" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 192 85 Q 210 90 215 75" stroke="#1c1cfe" strokeWidth="1.5" fill="none" opacity="0.7" />

        {/* Rod */}
        <motion.rect style={{ height: rodH }} x="161" y={105} width="18" rx="2" fill={STEEL_LIGHT} />

        {/* Press plate */}
        <motion.g style={{ y: plateY }} filter="url(#lp-shadow2)">
          <rect x="118" y="120" width="104" height="14" rx="3" fill="url(#lp-frame2)" />
          <rect x="118" y="120" width="104" height="4" rx="2" fill={STEEL_LIGHT} opacity="0.4" />
          <path d="M 155 134 L 170 154 L 185 134 Z" fill={STEEL_DARK} />
          <path d="M 158 134 L 170 150 L 182 134 Z" fill={STEEL} opacity="0.5" />
        </motion.g>

        {/* Lemon */}
        <motion.g style={{ scaleY: lemonScaleY, scaleX: lemonScaleX, transformOrigin: '170px 222px' }}>
          <ellipse cx="170" cy="222" rx="38" ry="28" fill="url(#lemon-grad2)" />
          <ellipse cx="170" cy="222" rx="32" ry="22" fill="none" stroke={YELLOW_DARK} strokeWidth="0.8" opacity="0.4" />
          <ellipse cx="206" cy="222" rx="7" ry="5" fill={YELLOW_DARK} opacity="0.7" />
          <ellipse cx="134" cy="222" rx="7" ry="5" fill={YELLOW_DARK} opacity="0.7" />
          <line x1="170" y1="196" x2="170" y2="248" stroke={YELLOW_DARK} strokeWidth="0.8" opacity="0.35" />
          <line x1="136" y1="212" x2="204" y2="232" stroke={YELLOW_DARK} strokeWidth="0.8" opacity="0.35" />
          <line x1="136" y1="232" x2="204" y2="212" stroke={YELLOW_DARK} strokeWidth="0.8" opacity="0.35" />
        </motion.g>

        {/* Juice */}
        <motion.g style={{ opacity: juiceOpacity, y: juiceY }}>
          <ellipse cx="155" cy="255" rx="4" ry="2.5" fill={YELLOW} opacity="0.7" />
          <ellipse cx="185" cy="258" rx="3" ry="2" fill={YELLOW} opacity="0.6" />
          <ellipse cx="168" cy="261" rx="5" ry="3" fill={YELLOW} opacity="0.8" />
          <ellipse cx="170" cy="266" rx="20" ry="4" fill={YELLOW} opacity="0.22" />
        </motion.g>

        {/* Control panel */}
        <rect x="245" y="115" width="68" height="125" rx="5"
          fill="rgba(14,14,20,0.96)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <text x="279" y="130" textAnchor="middle" fontSize="7" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.35)" letterSpacing="1">CTRL</text>

        <text x="279" y="146" textAnchor="middle" fontSize="6.5" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.4)">FORCE</text>
        <rect x="252" y="149" width="46" height="7" rx="2" fill="rgba(255,255,255,0.06)" />
        <motion.rect style={{ width: forceBarW }} x="252" y="149" height="7" rx="2" fill={GREEN} />
        <ReactiveText mv={forceN} format={v => `${Math.round(v)} N`}
          x="279" y="168" textAnchor="middle" fontSize="11" fontFamily="SF Mono, monospace" fontWeight="700" fill={STEEL_LIGHT} />

        <text x="279" y="184" textAnchor="middle" fontSize="6.5" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.4)">PWM DUTY</text>
        <ReactiveText mv={pwmDuty} format={v => `${Math.round(v)}%`}
          x="279" y="197" textAnchor="middle" fontSize="9.5" fontFamily="SF Mono, monospace" fill={STEEL_LIGHT} opacity="0.8" />

        <motion.circle cx="279" cy="212" r="5" style={{ fill: ledFill }} />
        <text x="279" y="228" textAnchor="middle" fontSize="6" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.28)">STATUS</text>
      </svg>

      {/* Press button */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <motion.button
          onMouseDown={startPress}
          onMouseUp={endPress}
          onMouseLeave={() => pressing && endPress()}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          whileHover={{ scale: 1.06 }}
          animate={{
            scale: pressing ? 0.93 : 1,
            background: pressing ? YELLOW : `${YELLOW}22`,
            color: pressing ? '#000' : YELLOW,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="px-4 py-1.5 rounded-full text-[11px] font-semibold font-mono border cursor-pointer"
          style={{ borderColor: `${YELLOW}44` }}
        >
          {pressing ? '⬇ Pressing…' : '⬆ Hold to press'}
        </motion.button>

        <AnimatePresence>
          {juiced && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={reset}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold font-mono border cursor-pointer"
              style={{ borderColor: `${STEEL}44`, color: STEEL, background: `${STEEL}18` }}
            >
              ↺ Reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Press count badge */}
      <AnimatePresence>
        {pressCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
            style={{ background: `${YELLOW}22`, color: YELLOW, border: `1px solid ${YELLOW}33` }}
          >
            🍋 ×{pressCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
