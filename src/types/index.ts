export type AgeTier = 'seedling' | 'explorer' | 'yogi';
export type AgeRange = '4-6' | '7-9' | '10-12' | 'both';
export type AilmentCategory = 'physical' | 'emotional';
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';
export type VocabularyLevel = 'animal-only' | 'intro-sanskrit' | 'full-sanskrit';

export interface Pose {
  id: string;
  englishName: string;
  sanskritName: string;
  animalName?: string;
  howItHelps: string;
  ageSuitability: AgeRange;
  holdTimeBreaths: { min: number; max: number };
  contraindications: string[];
  modificationNotes?: string;
  lottieAsset: string;
  thumbnailAsset: string;
}

export interface Ailment {
  id: string;
  category: AilmentCategory;
  displayName: string;
  childFriendlyName: string;
  emoji: string;
  accentColor: string;
  shortDescription: string;
  recommendedBreathingIds: string[];
  appTip: string;
  safetyNote?: string;
  alwaysShowSafetyBanner?: boolean;
  poses: Pose[];
}

export interface BreathCycle {
  phase: BreathPhase;
  durationSeconds: number;
  label: string;
  animationState: string;
}

export interface BreathingExercise {
  id: string;
  kidFriendlyName: string;
  traditionalName: string;
  ageSuitability: AgeRange;
  defaultCycles: number;
  cycle: BreathCycle[];
  whatItHelps: string[];
  instructions: string[];
  emoji: string;
  lottieAsset?: string;
  audioAsset?: string;
  gradientColors: [string, string];
}

export interface AgeProfile {
  tier: AgeTier;
  ageRange: '4-6' | '7-9' | '10-12';
  vocabularyLevel: VocabularyLevel;
  maxHoldBreaths: number;
  preferredCharacterName?: string;
  yogiColor?: string;
  hasAcceptedDisclaimer: boolean;
  disclaimerAcceptedAt?: number;
  parentPin?: string;
}

export interface SessionStep {
  type: 'pose' | 'transition' | 'breathing';
  poseId?: string;
  breathingId?: string;
  durationSeconds: number;
  instructionText: string;
}

export interface Session {
  id: string;
  ailmentId: string;
  ageTier: AgeTier;
  steps: SessionStep[];
  totalDurationSeconds: number;
}

export interface CompletedSession {
  sessionId: string;
  ailmentId: string;
  completedAt: number;
  durationSeconds: number;
  stepsCompleted: number;
  totalSteps: number;
  moodRating?: number;
}
