import { BreathingExercise } from '../../types';

export const flowerBreathing: BreathingExercise = {
  id: 'flower-breathing',
  kidFriendlyName: 'Flower Breathing',
  traditionalName: 'Flower Breathing',
  ageSuitability: 'both',
  defaultCycles: 5,
  emoji: '🌸',
  cycle: [
    {
      phase: 'inhale',
      durationSeconds: 4,
      label: 'Smell the Flower',
      animationState: 'expand',
    },
    {
      phase: 'exhale',
      durationSeconds: 5,
      label: 'Blow the Petals',
      animationState: 'contract',
    },
  ],
  whatItHelps: ['anxiety', 'stress', 'sleep'],
  instructions: [],
  gradientColors: ['#EC407A', '#F48FB1'],
};
