export const firstJourneyItems = [
  {
    season: 'FTC 2025–26 · DECODE',
    team: 'Team 23490 — Beta Blink',
    color: '#0071e3',
    role: 'Technical Lead',
    highlights: [
      'Designed and built a flywheel ball shooter capable of launching scoring elements at target velocity',
      'CNC-machined 6061-T6 aluminum frame components to ±0.001″ tolerances',
      'Integrated AprilTag localization with a custom Java PID controller for autonomous scoring',
      'Built custom wiring harnesses with strain-relieved Molex connectors and a fully-mounted REV Control Hub',
    ],
    stats: [
      { value: '1', label: 'FTC Season' },
      { value: '±0.001″', label: 'Tolerance' },
      { value: 'Java', label: 'Auton stack' },
      { value: 'Onshape', label: 'CAD tool' },
    ],
  },
]

export const decodeAwards = [
  {
    event: 'Upper South Conference Southern League Tournament',
    date: 'February 8, 2026',
    location: 'Hightstown, NJ',
    awards: [
      { title: 'Finalist Alliance — 1st Team Selected', highlight: true },
      { title: 'Advancement to NJ Championship', highlight: true },
      { title: 'Think Award — 2nd Place', highlight: false },
    ],
  },
  {
    event: 'Upper Central and Northern Post Season Scrimmage',
    date: 'May 23, 2026',
    location: 'Somerset, NJ',
    awards: [
      { title: '1st Place Tele-Op Performance', highlight: true },
      { title: '2nd Place Autonomous Performance', highlight: false },
      { title: '#1 Ranked Team — Overall Decode Performance', highlight: true },
    ],
  },
]

export const ftcProject = {
  id: 'ftc-beta-blink',
  title: 'FTC Team 23490',
  subtitle: 'Beta Blink',
  category: 'Competitive Robotics',
  year: '2025–26',
  description:
    'Designed and built a FIRST Tech Challenge robot for the DECODE season — featuring a precision flywheel ball shooter, CNC-machined aluminum structure, and Java autonomous routines.',
  features: [
    {
      label: 'Flywheel Ball Shooter',
      detail: 'Custom dual-flywheel shooter designed and assembled for accurate scoring element launching.',
    },
    {
      label: 'Autonomous Navigation',
      detail: 'AprilTag-based localization paired with a custom Java PID controller for reliable field-side scoring.',
    },
    {
      label: 'CNC-Machined Aluminum',
      detail: '6061-T6 alloy components milled to ±0.001″ tolerances for structural integrity under match stress.',
    },
  ],
  tags: ['Java', 'Onshape', 'CNC Machining', 'PID Control', 'FTC SDK'],
  visualType: 'shooter-assembly',
  color: '#0071e3',
}
