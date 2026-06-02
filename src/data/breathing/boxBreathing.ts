import { BreathingExercise } from '../../types';

export const boxBreathing: BreathingExercise = {
  id: 'box-breathing',
  kidFriendlyName: 'Square Breathing',
  traditionalName: 'Box Breathing',
  ageSuitability: 'both',
  defaultCycles: 4,
  emoji: '🟦',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 4,
      label: 'Breathe In',
      animationState: 'expand',
    },
    {
      phase: 'hold',
      durationSeconds: 4,
      label: 'Hold',
      animationState: 'hold',
    },
    {
      phase: 'exhale',
      durationSeconds: 4,
      label: 'Breathe Out',
      animationState: 'contract',
    },
    {
      phase: 'holdAfterExhale',
      durationSeconds: 4,
      label: 'Hold Empty',
      animationState: 'hold',
    },
  ],
  whatItHelps: ['anxiety', 'stress', 'focus'],
  instructions: [],
  gradientColors: ['#7986CB', '#9FA8DA'],
};
