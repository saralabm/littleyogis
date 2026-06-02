import { BreathingExercise } from '../../types';

export const starBreathing: BreathingExercise = {
  id: 'star-breathing',
  kidFriendlyName: 'Star Breathing',
  traditionalName: 'Star Breathing',
  ageSuitability: 'both',
  defaultCycles: 5,
  emoji: '⭐',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 3,
      label: 'Shine Bright',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 3,
      label: 'Glow Out',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'stress'],
  instructions: [],
  gradientColors: ['#F9A825', '#FFD54F'],
};
