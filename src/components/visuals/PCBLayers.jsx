import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'

// PCB layout constants
const BOARD = { x: 22, y: 18, w: 296, h: 284 }
const MCU = { x: 118, y: 48, w: 104, h: 44 }

const LEDS = [
  { id: 'D1', x: 46, y: 72, label: 'D1' },
  { id: 'D2', x: 46, y: 112, label: 'D2' },
  { id: 'D3', x: 46, y: 152, label: 'D3' },
  { id: 'D4', x: 294, y: 72, label: 'D4' },
  { id: 'D5', x: 294, y: 112, label: 'D5' },
  { id: 'D6', x: 294, y: 152, label: 'D6' },
]

const SWITCHES = [
  { id: 'SW6', x: 80, y: 195, label: 'SW6' },
  { id: 'SW5', x: 170, y: 195, label: 'SW5' },
  { id: 'SW3', x: 260, y: 195, label: 'SW3' },
  { id: 'SW1', x: 80, y: 260, label: 'SW1' },
  { id: 'SW2', x: 170, y: 260, label: 'SW2' },
  { id: 'SW4', x: 260, y: 260, label: 'SW4' },
]

const TRACES = [
  {
    id: 'vcc-left', label: 'VCC → Left LEDs',
    detail: '3.3V rail to D1–D3, power-limited in firmware to respect MCU 200mA VReg limit',
    color: '#ff9f0a',
    path: 'M 118 54 L 46 54 L 46 72',
    startT: 0.05, endT: 0.18,
  },
  {
    id: 'vcc-right', label: 'VCC → Right LEDs',
    detail: '3.3V rail from XIAO to D4–D6, same current budget shared across both columns',
    color: '#ff9f0a',
    path: 'M 222 54 L 294 54 L 294 72',
    startT: 0.08, endT: 0.20,
  },
  {
    id: 'led-data', label: 'XIAO → D1 data',
    detail: 'SK6812MINI-E single-wire data from XIAO GPIO to first LED — WS2812-compatible protocol',
    color: '#30d158',
    path: 'M 118 84 L 46 84 L 46 72',
    startT: 0.16, endT: 0.28,
  },
  {
    id: 'led-chain-left', label: 'D1 → D2 → D3',
    detail: 'Daisy-chained LED data: each LED passes DIN signal to DOUT to drive the next in column',
    color: '#30d158',
    path: 'M 46 72 L 46 152',
    startT: 0.26, endT: 0.36,
  },
  {
    id: 'led-crossover', label: 'D3 → D4 crossover',
    detail: 'Data crosses board via back-copper trace (routed under switches) to reach right LED column',
    color: '#30d158',
    path: 'M 46 152 L 46 293 L 294 293 L 294 152',
    startT: 0.34, endT: 0.50,
  },
  {
    id: 'led-chain-right', label: 'D4 → D5 → D6',
    detail: 'Right LED column chain completes the ring: D4 → D5 → D6 (6 LEDs total)',
    color: '#30d158',
    path: 'M 294 152 L 294 72',
    startT: 0.48, endT: 0.58,
  },
  {
    id: 'gpio-sw6', label: 'SW6 → XIAO D0',
    detail: 'Direct GPIO — SW6 (top-left key) wired straight to XIAO pin D0, no matrix scanning',
    color: '#0071e3',
    path: 'M 118 60 L 80 60 L 80 182',
    startT: 0.55, endT: 0.65,
  },
  {
    id: 'gpio-sw1', label: 'SW1 → XIAO D1',
    detail: 'Direct GPIO — SW1 (bottom-left) to XIAO D1: bypasses matrix for hardware-speed response',
    color: '#0071e3',
    path: 'M 118 66 L 68 66 L 68 260 L 80 260',
    startT: 0.59, endT: 0.69,
  },
  {
    id: 'gpio-sw5', label: 'SW5 → XIAO D2',
    detail: 'Direct GPIO — SW5 (top-center) to XIAO D2: mapped to macro layer toggle in firmware',
    color: '#7b61ff',
    path: 'M 118 72 L 92 72 L 92 182 L 170 182 L 170 182',
    startT: 0.63, endT: 0.73,
  },
  {
    id: 'gpio-sw2', label: 'SW2 → XIAO D3',
    detail: 'Direct GPIO — SW2 (bottom-center) to XIAO D3: stream scene switch shortcut',
    color: '#7b61ff',
    path: 'M 118 78 L 100 78 L 100 247 L 170 247 L 170 247',
    startT: 0.67, endT: 0.77,
  },
  {
    id: 'gpio-sw3', label: 'SW3 → XIAO D4',
    detail: 'Direct GPIO — SW3 (top-right) to XIAO D4: mute/unmute shortcut binding',
    color: '#ff453a',
    path: 'M 222 60 L 260 60 L 260 182',
    startT: 0.71, endT: 0.81,
  },
  {
    id: 'gpio-sw4', label: 'SW4 → XIAO D5',
    detail: 'Direct GPIO — SW4 (bottom-right) to XIAO D5: app launcher / spotlight trigger',
    color: '#ff453a',
    path: 'M 222 66 L 272 66 L 272 260 L 260 260',
    startT: 0.75, endT: 0.85,
  },
]

function TraceLayer({ progress, hovered, setHovered }) {
  return (
    <g>
      {TRACES.map(trace => {
        const tp = useTransform(progress, [trace.startT, trace.endT], [0, 1])
        const isHov = hovered === trace.id
        return (
          <motion.path
            key={trace.id}
            d={trace.path}
            stroke={trace.color}
            strokeWidth={isHov ? 3 : 1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ pathLength: tp, opacity: isHov ? 1 : 0.72 }}
            filter={isHov ? `drop-shadow(0 0 4px ${trace.color})` : undefined}
            onMouseEnter={() => setHovered(trace.id)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          />
        )
      })}
    </g>
  )
}

export default function PCBLayers({ progress }) {
  const [hovered, setHovered] = useState(null)
  const boardOp = useTransform(progress, [0, 0.06], [0, 1])
  const compsOp = useTransform(progress, [0.04, 0.14], [0, 1])
  const labelOp = useTransform(progress, [0.88, 0.96], [0, 1])

  const hoveredTrace = hovered ? TRACES.find(t => t.id === hovered) : null

  return (
    <div className="relative w-full h-full bg-[#060c1a]">
      <svg viewBox="0 0 340 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

        {/* Board */}
        <motion.g style={{ opacity: boardOp }}>
          <rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx="10"
            fill="#0b1830" stroke="#162545" strokeWidth="1.5" />
          {/* Corner holes */}
          {[[36, 32], [306, 32], [36, 296], [306, 296]].map(([hx, hy], i) => (
            <g key={i}>
              <circle cx={hx} cy={hy} r="6.5" fill="#060c1a" stroke="#162545" strokeWidth="1" />
              <circle cx={hx} cy={hy} r="3" fill="none" stroke="#243560" strokeWidth="0.8" />
            </g>
          ))}
          {/* Faint grid */}
          {[80, 170, 260].map(gx => (
            <line key={gx} x1={gx} y1={BOARD.y} x2={gx} y2={BOARD.y + BOARD.h}
              stroke="#162540" strokeWidth="0.4" strokeDasharray="2 8" opacity="0.35" />
          ))}
          {[80, 170, 260].map(gy => (
            <line key={gy} x1={BOARD.x} y1={gy} x2={BOARD.x + BOARD.w} y2={gy}
              stroke="#162540" strokeWidth="0.4" strokeDasharray="2 8" opacity="0.35" />
          ))}
        </motion.g>

        {/* Traces */}
        <TraceLayer progress={progress} hovered={hovered} setHovered={setHovered} />

        {/* Components */}
        <motion.g style={{ opacity: compsOp }}>
          {/* MCU */}
          <rect x={MCU.x} y={MCU.y} width={MCU.w} height={MCU.h} rx="3"
            fill="#0e1e3a" stroke="#1e3060" strokeWidth="1" />
          <rect x={MCU.x + 10} y={MCU.y + 5} width={MCU.w - 20} height={MCU.h - 10} rx="2"
            fill="#162040" stroke="#243a80" strokeWidth="0.8" />
          {/* Left header pins */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <rect key={i} x={MCU.x - 5} y={MCU.y + 9 + i * 5.2} width={5} height={3} rx="0.5"
              fill="#b8922a" stroke="#907020" strokeWidth="0.3" />
          ))}
          {/* Right header pins */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <rect key={i} x={MCU.x + MCU.w} y={MCU.y + 9 + i * 5.2} width={5} height={3} rx="0.5"
              fill="#b8922a" stroke="#907020" strokeWidth="0.3" />
          ))}
          {/* USB-C */}
          <rect x={MCU.x + MCU.w / 2 - 7} y={MCU.y - 7} width={14} height={8} rx="2.5"
            fill="#2a2a3a" stroke="#3a3a50" strokeWidth="0.8" />
          <text x={MCU.x + MCU.w / 2} y={MCU.y + 21} textAnchor="middle"
            fontSize="5.8" fontFamily="SF Mono, monospace" fill="#3a5a9a" letterSpacing="0.3">Seeed Studio</text>
          <text x={MCU.x + MCU.w / 2} y={MCU.y + 31} textAnchor="middle"
            fontSize="7.5" fontFamily="SF Mono, monospace" fill="#5a7acc" fontWeight="600" letterSpacing="0.6">XIAO</text>
          <text x={MCU.x + MCU.w / 2} y={MCU.y + 40} textAnchor="middle"
            fontSize="4.5" fontFamily="SF Mono, monospace" fill="#2a4070" letterSpacing="0.3">RP2040</text>

          {/* LEDs */}
          {LEDS.map(led => (
            <g key={led.id}>
              <rect x={led.x - 7} y={led.y - 6} width={14} height={12} rx="2"
                fill="#0e1a30" stroke="#1a2a50" strokeWidth="0.8" />
              <rect x={led.x - 4} y={led.y - 4} width={8} height={8} rx="1"
                fill="#162040" stroke="#2a4070" strokeWidth="0.6" />
              <circle cx={led.x} cy={led.y} r="1.5" fill="#30d158" opacity="0.6" />
              <text x={led.x} y={led.y + 16} textAnchor="middle"
                fontSize="5.5" fontFamily="SF Mono, monospace" fill="#2a4070">{led.label}</text>
            </g>
          ))}

          {/* Switches */}
          {SWITCHES.map(sw => (
            <g key={sw.id}>
              <rect x={sw.x - 14} y={sw.y - 14} width={28} height={28} rx="3"
                fill="#0c1828" stroke="#1a2a48" strokeWidth="1" />
              <rect x={sw.x - 8} y={sw.y - 8} width={16} height={16} rx="2"
                fill="#0a1420" stroke="#162035" strokeWidth="0.6" />
              <circle cx={sw.x} cy={sw.y} r="4" fill="#0a1020" stroke="#1a2a45" strokeWidth="0.8" />
              <circle cx={sw.x} cy={sw.y} r="1.5" fill="#1e3050" />
              <text x={sw.x} y={sw.y + 22} textAnchor="middle"
                fontSize="5.5" fontFamily="SF Mono, monospace" fill="#2a4060" opacity="0.8">{sw.label}</text>
            </g>
          ))}

          {/* Silkscreen labels */}
          <text x="170" y="308" textAnchor="middle"
            fontSize="9" fontFamily="SF Mono, monospace" fill="#1e3065" opacity="0.6" letterSpacing="2">{'<AD>'}</text>
          <text x="170" y="36" textAnchor="middle"
            fontSize="6.5" fontFamily="SF Mono, monospace" fill="#1a2e58" opacity="0.5" letterSpacing="0.8">AD DEV PAD v1.0</text>
        </motion.g>

        {/* Hover tooltip */}
        {hoveredTrace && (() => {
          const parts = hoveredTrace.path.split(' ')
          const mx = parseFloat(parts[1])
          const my = parseFloat(parts[2])
          const tx = mx > 180 ? mx - 115 : mx + 10
          const ty = Math.max(24, Math.min(my - 20, 255))
          return (
            <g>
              <rect x={tx - 2} y={ty - 2} width={112} height={46} rx="6"
                fill="rgba(6,12,26,0.97)" stroke={hoveredTrace.color} strokeWidth="0.8" />
              <text x={tx + 5} y={ty + 12} fontSize="6.5" fontFamily="SF Mono, monospace"
                fill={hoveredTrace.color} fontWeight="600">{hoveredTrace.label}</text>
              <foreignObject x={tx + 3} y={ty + 16} width="104" height="28">
                <div xmlns="http://www.w3.org/1999/xhtml"
                  style={{ fontSize: '5.5px', fontFamily: 'SF Mono, monospace', color: 'rgba(180,200,240,0.65)', lineHeight: '1.55' }}>
                  {hoveredTrace.detail}
                </div>
              </foreignObject>
            </g>
          )
        })()}

        {/* Corner label */}
        <motion.g style={{ opacity: labelOp }}>
          <rect x="26" y="22" width="84" height="26" rx="4"
            fill="rgba(6,12,26,0.88)" stroke="rgba(123,97,255,0.35)" strokeWidth="0.8" />
          <text x="32" y="32" fontSize="6.5" fontFamily="SF Mono, monospace" fill="#7b61ff" fontWeight="600">AD Dev Pad</text>
          <text x="32" y="42" fontSize="5.5" fontFamily="SF Mono, monospace" fill="rgba(255,255,255,0.35)">6-key · KiCad · XIAO</text>
        </motion.g>
      </svg>
    </div>
  )
}
