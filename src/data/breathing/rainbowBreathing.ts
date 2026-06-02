import { BreathingExercise } from '../../types';

export const rainbowBreathing: BreathingExercise = {
  id: 'rainbow-breathing',
  kidFriendlyName: 'Rainbow Breathing',
  traditionalName: 'Rainbow Breathing',
  ageSuitability: 'both',
  defaultCycles: 5,
  emoji: '🌈',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 4,
      label: 'Breathe In',
      animationState: 'expand',
    },
    {
      phase: 'hold',
      durationSeconds: 2,
      label: 'Hold',
      animationState: 'hold',
    },
    {
      phase: 'exhale',
      durationSeconds: 4,
      label: 'Breathe Out',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'stress'],
  instructions: [],
  gradientColors: ['#E91E63', '#FF9800'],
};
