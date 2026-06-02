import { BreathingExercise } from '../../types';
export const bumblebeeBreath: BreathingExercise = {
  id: 'bumblebee-breath', kidFriendlyName: 'Bumblebee Buzz Breath', traditionalName: 'Bhramari Pranayama',
  ageSuitability: '7-9', defaultCycles: 5, emoji: '🐝',
  cycle: [
    { phase: 'inhale', durationSeconds: 3, label: 'Breathe In', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 5, label: 'Hmmm...', animationState: 'contract' },
  ],
  whatItHelps: ['anxiety', 'sleep', 'focus', 'anger'], instructions: ['Cover your ears gently and close your eyes.', 'Take a big breath in through your nose.', 'As you breathe out, make a long "mmmmm" humming sound like a bumblebee!'],
  gradientColors: ['#FFB300', '#FFD54F'],
};
