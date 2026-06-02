import { BreathingExercise } from '../../types';
export const dragonBreath: BreathingExercise = {
  id: 'dragon-breath', kidFriendlyName: 'Dragon Fire Breath', traditionalName: 'Simhasana Exhale',
  ageSuitability: '4-6', defaultCycles: 6, emoji: '🐉',
  cycle: [
    { phase: 'inhale', durationSeconds: 3, label: 'Breathe In', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 2, label: 'HAAAAH!', animationState: 'contract' },
  ],
  whatItHelps: ['energy', 'anger', 'anxiety'], instructions: ['Sit like a big dragon with your hands on your knees.', 'Take a BIG breath in through your nose.', 'Open your mouth wide and breathe out — HAAAAH! like dragon fire!'],
  gradientColors: ['#EF5350', '#FF7043'],
};
