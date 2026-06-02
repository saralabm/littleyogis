import { useProfileStore } from '../../store/useProfileStore';
import type { AgeTier } from '../../types';

export interface AgeTheme {
  backgroundColor: string;
  accentColor: string;
  bodyFontSize: number;
  instructionFontSize: number;
  showYogi: boolean;
  yogiSize: number;
  showStreak: boolean;
  showSanskrit: boolean;
  autoAdvanceSession: boolean;
  timerStyle: 'jar' | 'ring';
  showBreathCount: boolean;
}

const THEME_MAP: Record<AgeTier, AgeTheme> = {
  seedling: {
    backgroundColor: '#FFF8E1', accentColor: '#FFB300',
    bodyFontSize: 22, instructionFontSize: 24,
    showYogi: true, yogiSize: 120,
    showStreak: false, showSanskrit: false,
    autoAdvanceSession: true, timerStyle: 'jar', showBreathCount: false,
  },
  explorer: {
    backgroundColor: '#F1F8E9', accentColor: '#558B2F',
    bodyFontSize: 18, instructionFontSize: 18,
    showYogi: true, yogiSize: 64,
    showStreak: true, showSanskrit: false,
    autoAdvanceSession: false, timerStyle: 'ring', showBreathCount: true,
  },
  yogi: {
    backgroundColor: '#E8EAF6', accentColor: '#3949AB',
    bodyFontSize: 16, instructionFontSize: 16,
    showYogi: false, yogiSize: 0,
    showStreak: true, showSanskrit: true,
    autoAdvanceSession: false, timerStyle: 'ring', showBreathCount: true,
  },
};

export function useAgeTheme(): AgeTheme {
  const profile = useProfileStore((s) => s.profile);
  return THEME_MAP[profile?.tier ?? 'explorer'];
}
