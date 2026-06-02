import { BreathingExercise } from '../../types';
export const rainbowBreathing: BreathingExercise = {
  id: 'rainbow-breathing', kidFriendlyName: 'Rainbow Breathing', traditionalName: 'Visualization Breathing',
  ageSuitability: '4-6', defaultCycles: 5, emoji: '🌈',
  cycle: [
    { phase: 'inhale', durationSeconds: 4, label: 'Draw Your Rainbow', animationState: 'expand' },
    { phase: 'hold', durationSeconds: 2, label: 'See It!', animationState: 'hold' },
    { phase: 'exhale', durationSeconds: 4, label: 'Let It Rain', animationState: 'contract' },
  ],
  whatItHelps: ['anxiety', 'energy', 'calm'], instructions: ['Stand with your arms by your sides.', 'Breathe in and sweep your arms up in a rainbow arc over your head.', 'Breathe out and sweep your arms back down like gentle rain.'],
  gradientColors: ['#E91E63', '#FF9800'],
};
