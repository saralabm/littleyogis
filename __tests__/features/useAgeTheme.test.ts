import { renderHook } from '@testing-library/react-native';
import { useAgeTheme } from '../../src/features/age-adaptive/useAgeTheme';
import { useProfileStore } from '../../src/store/useProfileStore';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

function setTier(tier: 'seedling' | 'explorer' | 'yogi') {
  useProfileStore.setState({ profile: { tier, ageRange: tier === 'seedling' ? '4-6' : tier === 'explorer' ? '7-9' : '10-12', vocabularyLevel: 'intro-sanskrit', maxHoldBreaths: 8, hasAcceptedDisclaimer: true } });
}

describe('useAgeTheme', () => {
  describe('seedling', () => {
    beforeEach(() => setTier('seedling'));
    it('returns warm cream background', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.backgroundColor).toBe('#FFF8E1');
    });
    it('bodyFontSize is 22', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.bodyFontSize).toBe(22);
    });
    it('autoAdvanceSession is true', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.autoAdvanceSession).toBe(true);
    });
    it('timerStyle is jar', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.timerStyle).toBe('jar');
    });
  });

  describe('yogi', () => {
    beforeEach(() => setTier('yogi'));
    it('returns cool lavender background', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.backgroundColor).toBe('#E8EAF6');
    });
    it('showSanskrit is true', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.showSanskrit).toBe(true);
    });
    it('showYogi is false', () => {
      const { result } = renderHook(() => useAgeTheme());
      expect(result.current.showYogi).toBe(false);
    });
  });
});
