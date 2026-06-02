import { BreathingExercise } from '../../types';
export const flowerBreathing: BreathingExercise = {
  id: 'flower-breathing', kidFriendlyName: 'Flower Breathing', traditionalName: 'Visualization Breathing',
  ageSuitability: '4-6', defaultCycles: 6, emoji: '🌸',
  cycle: [
    { phase: 'inhale', durationSeconds: 4, label: 'Smell the Flower', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 5, label: 'Blow Gently', animationState: 'contract' },
  ],
  whatItHelps: ['anxiety', 'sleep', 'calm'], instructions: ['Hold your hand flat like a flower.', 'Breathe in slowly through your nose — smell the most beautiful flower!', 'Breathe out gently through your mouth — blow the petals very softly.'],
  gradientColors: ['#EC407A', '#F48FB1'],
};
