import { BreathingExercise } from '../../types';
export const oceanBreathing: BreathingExercise = {
  id: 'ocean-breathing', kidFriendlyName: 'Ocean Waves Breath', traditionalName: 'Ujjayi Pranayama',
  ageSuitability: '7-9', defaultCycles: 8, emoji: '🌊',
  cycle: [
    { phase: 'inhale', durationSeconds: 4, label: 'Wave In', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 4, label: 'Wave Out', animationState: 'contract' },
  ],
  whatItHelps: ['anxiety', 'focus', 'sleep', 'calm'], instructions: ['Close your mouth and breathe in through your nose with a gentle "shhh" sound.', 'Breathe out the same way — make each breath sound like an ocean wave.'],
  gradientColors: ['#0288D1', '#4FC3F7'],
};
