export const projects = [
  {
    id: 'ai-vision-arm',
    title: 'AI Vision',
    subtitle: 'Sorting Arm',
    category: 'Computer Vision · Robotics',
    year: '2026',
    description:
      'A 6-DOF robotic arm that uses a Roboflow-trained YOLOv8 model for real-time object detection, classifying items by category and color before sorting them into bins with sub-centimeter accuracy.',
    features: [
      {
        label: 'Roboflow Real-Time Detection',
        detail: 'Custom YOLOv8 model running live, classifying items by type, color, and orientation at 30 FPS.',
      },
      {
        label: '6-DOF Inverse Kinematics',
        detail: 'IK engine computes all 6 joint angles on-the-fly for smooth, collision-free trajectories.',
      },
      {
        label: '94% Sorting Accuracy',
        detail: 'Simultaneously identifies object type, color, and orientation — achieving 94% sorting accuracy in testing.',
      },
    ],
    tags: ['Python', 'Roboflow', 'YOLOv8', 'Arduino Uno R4', 'OpenCV', 'Servo PWM'],
    visualType: 'ai-vision',
    color: '#30d158',
  },
  {
    id: 'custom-dev-pad',
    title: 'AD Dev Pad',
    subtitle: 'Custom Workflow Macroboard',
    category: 'Electronics · PCB Design',
    year: '2026',
    description:
      'A fully custom 6-key macroboard built end-to-end — from KiCad PCB routing to Python firmware. Direct-to-pin GPIO architecture with SK6812MINI-E per-key RGB and zero-latency triggers.',
    features: [
      {
        label: 'Direct-to-Pin Architecture',
        detail: 'Custom-routed KiCad PCB on a Seeed Studio XIAO MCU bypasses matrix wiring for zero-latency GPIO triggers.',
      },
      {
        label: 'SK6812MINI-E RGB LEDs',
        detail: 'Six individually-addressable RGB LEDs, power-limited in firmware to stay within the 200mA VReg limit.',
      },
      {
        label: 'Python HID Firmware',
        detail: 'Full Python firmware stack with macro layers, stream controls, and reactive per-key lighting effects.',
      },
    ],
    tags: ['KiCad', 'Python', 'Seeed XIAO', 'PCB Design', 'SK6812', 'USB HID'],
    visualType: 'pcb-layers',
    color: '#7b61ff',
  },
]
