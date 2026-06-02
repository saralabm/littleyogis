import { BreathingExercise } from '../../types';

export const bellyBreathing: BreathingExercise = {
  id: 'belly-breathing',
  kidFriendlyName: 'Tummy Riser Breathing',
  traditionalName: 'Abdominal Breathing',
  ageSuitability: 'both',
  defaultCycles: 6,
  emoji: '🫁',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 4,
      label: 'Tummy Up',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 4,
      label: 'Tummy Down',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'stress', 'sleep'],
  instructions: [],
  gradientColors: ['#66BB6A', '#A5D6A7'],
};
