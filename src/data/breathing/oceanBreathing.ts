import { BreathingExercise } from '../../types';

export const oceanBreathing: BreathingExercise = {
  id: 'ocean-breathing',
  kidFriendlyName: 'Ocean Waves Breath',
  traditionalName: 'Ujjayi Pranayama',
  ageSuitability: 'both',
  defaultCycles: 8,
  emoji: '🌊',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 4,
      label: 'Wave In',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 4,
      label: 'Wave Out',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'stress', 'sleep'],
  instructions: [],
  gradientColors: ['#0288D1', '#4FC3F7'],
};
