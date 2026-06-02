import { AgeTier, VocabularyLevel } from '../types';

export function tierFromAge(age: number): AgeTier {
  if (age < 1 || age > 18) {
    throw new RangeError(`Age ${age} is out of supported range (1–18).`);
  }
  if (age <= 6) return 'seedling';
  if (age <= 9) return 'explorer';
  return 'yogi';
}

export function vocabLevel(tier: AgeTier): VocabularyLevel {
  switch (tier) {
    case 'seedling': return 'animal-only';
    case 'explorer': return 'intro-sanskrit';
    case 'yogi':     return 'full-sanskrit';
  }
}

export function maxBreaths(tier: AgeTier): number {
  switch (tier) {
    case 'seedling': return 6;
    case 'explorer': return 8;
    case 'yogi':     return 10;
  }
}
