import { BreathingExercise } from '../../types';

export const balloonBreathing: BreathingExercise = {
  id: 'balloon-breathing',
  kidFriendlyName: 'Balloon Belly Breathing',
  traditionalName: 'Diaphragmatic Breathing',
  ageSuitability: 'both',
  defaultCycles: 7,
  emoji: '🎈',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 4,
      label: 'Breathe In',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 6,
      label: 'Breathe Out',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'asthma', 'headaches', 'sleep', 'stress'],
  instructions: [
    'Lie on your back or sit up nice and tall.',
    'Place one hand on your chest and one hand on your tummy.',
    'Imagine your tummy is a big, colourful balloon.',
    'Breathe in slowly through your nose for 4 counts — feel your balloon tummy grow BIG.',
    'Breathe out slowly through your mouth for 6 counts — feel your balloon tummy go flat.',
    'The hand on your chest should stay still. Only your tummy should move!',
    'Repeat 5–10 times.',
  ],
  gradientColors: ['#81C784', '#A5D6A7'],
};
