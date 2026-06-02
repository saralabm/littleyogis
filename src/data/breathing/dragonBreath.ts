import { BreathingExercise } from '../../types';

export const dragonBreath: BreathingExercise = {
  id: 'dragon-breath',
  kidFriendlyName: 'Dragon Fire Breath',
  traditionalName: 'Kapalabhati Pranayama',
  ageSuitability: 'both',
  defaultCycles: 6,
  emoji: '🐉',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 3,
      label: 'Breathe In',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 2,
      label: 'Fire Breath Out',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['low-energy', 'focus'],
  instructions: [],
  gradientColors: ['#EF5350', '#FF7043'],
};
