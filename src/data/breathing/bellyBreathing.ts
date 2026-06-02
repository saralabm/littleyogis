import { BreathingExercise } from '../../types';
export const bellyBreathing: BreathingExercise = {
  id: 'belly-breathing', kidFriendlyName: 'Tummy Riser Breathing', traditionalName: 'Diaphragmatic Breathing',
  ageSuitability: 'both', defaultCycles: 6, emoji: '🫁',
  cycle: [
    { phase: 'inhale', durationSeconds: 4, label: 'Tummy Rises', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 4, label: 'Tummy Falls', animationState: 'contract' },
  ],
  whatItHelps: ['anxiety', 'sleep', 'calm'], instructions: ['Lie down and place your favourite toy on your tummy.', 'Breathe in slowly — watch your toy rise up!', 'Breathe out slowly — watch your toy go back down.'],
  gradientColors: ['#66BB6A', '#A5D6A7'],
};
