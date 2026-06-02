import { BreathingExercise } from '../../types';
export const boxBreathing: BreathingExercise = {
  id: 'box-breathing', kidFriendlyName: 'Square Breathing', traditionalName: 'Sama Vritti Pranayama',
  ageSuitability: '7-9', defaultCycles: 4, emoji: '🟦',
  cycle: [
    { phase: 'inhale', durationSeconds: 4, label: 'Breathe In', animationState: 'expand' },
    { phase: 'hold', durationSeconds: 4, label: 'Hold', animationState: 'hold' },
    { phase: 'exhale', durationSeconds: 4, label: 'Breathe Out', animationState: 'contract' },
    { phase: 'holdAfterExhale', durationSeconds: 4, label: 'Hold', animationState: 'rest' },
  ],
  whatItHelps: ['focus', 'anxiety', 'energy', 'anger'], instructions: ['Imagine drawing a square.', 'Breathe in for 4, hold for 4, breathe out for 4, hold for 4.', "That's one box — try 4 boxes!"],
  gradientColors: ['#7986CB', '#9FA8DA'],
};
