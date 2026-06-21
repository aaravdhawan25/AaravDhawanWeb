export const firstJourneyItems = [
  {
    season: 'FTC 2025–26 · DECODE',
    slug: 'decode',
    team: 'Team 23490 — Beta Blink',
    color: '#0071e3',
    role: 'Technical Lead',
    hasRobot: true,
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
  {
    season: 'FLL 2024–25 · SUBMERGED',
    slug: 'submerged',
    team: 'Bot Busters',
    color: '#06b6d4',
    role: 'Programmer & Researcher',
    hasRobot: false,
    highlights: [
      'Developed a banana blossom fish alternative as a sustainable solution to overfishing for the SUBMERGED challenge',
      'Won Breakthrough Award and Robot Performance Award at qualifiers, advancing to NJ States Championship',
      'Received Judges Award at Regionals and earned an invitation to the American Robotics Open Competition',
      'Won 1st Place Innovation Project at AROC — a prestigious national-level competition',
    ],
    stats: [
      { value: '1st', label: 'AROC Innovation' },
      { value: 'AROC', label: 'Invited' },
      { value: 'Judges', label: 'Award' },
      { value: '2024–25', label: 'Season' },
    ],
  },
  {
    season: 'FLL 2023–24 · MASTERPIECE',
    slug: 'masterpiece',
    team: 'Titan Tech',
    color: '#a855f7',
    role: 'Programmer & Researcher',
    hasRobot: false,
    highlights: [
      'Designed a reliable shoe sole prototype for the MASTERPIECE Innovation Project on empowering art through engineering',
      'Won Engineering Excellence Award at qualifiers and advanced to NJ States Championship',
      'Earned Innovation Project Award 2nd Place at Regionals, advancing to the Global Innovation Challenge',
      'Filed a patent for the shoe outsoles project design',
    ],
    stats: [
      { value: '2nd', label: 'IP at Regionals' },
      { value: 'Global', label: 'Innovation Challenge' },
      { value: 'Patent', label: 'Filed' },
      { value: '2023–24', label: 'Season' },
    ],
  },
  {
    season: 'FLL 2022–23 · SUPERPOWERED',
    slug: 'superpowered',
    team: 'Titan Tech',
    color: '#f59e0b',
    role: 'Programmer & Researcher',
    hasRobot: false,
    highlights: [
      'Researched methanol as a reliable alternative fuel source for the SUPERPOWERED energy challenge',
      'Developed and presented the Innovation Project at qualifiers, winning 1st Place',
      "Advanced to NJ States Championship representing the team's project work",
    ],
    stats: [
      { value: '1st', label: 'Innovation Project' },
      { value: 'States', label: 'Advanced To' },
      { value: 'FLL', label: 'Program' },
      { value: '2022–23', label: 'Season' },
    ],
  },
]

export const superpoweredAwards = [
  {
    event: 'Qualifiers',
    date: 'January 2023',
    location: 'New Jersey',
    awards: [
      { title: '1st Place Innovation Project', highlight: true },
      { title: 'Advancement To NJ States Championship', highlight: true },
    ],
  },
  {
    event: 'NJ States Championship',
    date: 'February 2023',
    location: 'New Jersey',
    awards: [
      { title: 'Competed at State Level', highlight: false },
    ],
  },
]

export const masterpieceAwards = [
  {
    event: 'Qualifiers',
    date: 'January 2024',
    location: 'New Jersey',
    awards: [
      { title: 'Engineering Excellence Award', highlight: true },
      { title: 'Advancement To NJ States Championship', highlight: true },
    ],
  },
  {
    event: 'Regionals',
    date: 'February 2024',
    location: 'New Jersey',
    awards: [
      { title: 'Innovation Project Award — 2nd Place', highlight: true },
      { title: 'Advancement to Global Innovation Challenge', highlight: true },
      { title: 'Filed Patent — Shoe Outsoles Design', highlight: false },
    ],
  },
]

export const submergedAwards = [
  {
    event: 'Qualifiers',
    date: 'January 2025',
    location: 'New Jersey',
    awards: [
      { title: 'Breakthrough Award', highlight: true },
      { title: 'Robot Performance Award', highlight: false },
      { title: 'Advancement To NJ States Championship', highlight: true },
    ],
  },
  {
    event: 'Regionals — NJ States Championship',
    date: 'February 2025',
    location: 'New Jersey',
    awards: [
      { title: 'Judges Award', highlight: false },
      { title: 'Invited to American Robotics Open Competition', highlight: true },
    ],
  },
  {
    event: 'American Robotics Open Competition (AROC)',
    date: 'April 2025',
    location: 'USA',
    awards: [
      { title: '1st Place Innovation Project', highlight: true },
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
