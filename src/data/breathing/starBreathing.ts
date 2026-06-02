import { BreathingExercise } from '../../types';
export const starBreathing: BreathingExercise = {
  id: 'star-breathing', kidFriendlyName: 'Star Breathing', traditionalName: '5-Point Visual Breathing',
  ageSuitability: '4-6', defaultCycles: 5, emoji: '⭐',
  cycle: [
    { phase: 'inhale', durationSeconds: 3, label: 'Up the Star', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 3, label: 'Down the Star', animationState: 'contract' },
  ],
  whatItHelps: ['anxiety', 'focus', 'calm'], instructions: ['Hold up one hand and spread your fingers like a star.', 'Trace up each finger as you breathe in, down as you breathe out.', 'Do all five points of your star!'],
  gradientColors: ['#F9A825', '#FFD54F'],
};
