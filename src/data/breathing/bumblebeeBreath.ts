import { BreathingExercise } from '../../types';

export const bumblebeeBreath: BreathingExercise = {
  id: 'bumblebee-breath',
  kidFriendlyName: 'Bumblebee Buzz Breath',
  traditionalName: 'Bhramari Pranayama',
  ageSuitability: 'both',
  defaultCycles: 5,
  emoji: '🐝',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 3,
      label: 'Breathe In',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 5,
      label: 'Buzz Out',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'stress'],
  instructions: [],
  gradientColors: ['#FFB300', '#FFD54F'],
};
