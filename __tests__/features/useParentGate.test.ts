import { renderHook, act } from '@testing-library/react-native';
import { useParentGate } from '../../src/features/parent/useParentGate';
import { useProfileStore } from '../../src/store/useProfileStore';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
  jest.useFakeTimers();
  useProfileStore.setState({ profile: { tier: 'explorer', ageRange: '7-9', vocabularyLevel: 'intro-sanskrit', maxHoldBreaths: 8, hasAcceptedDisclaimer: true, parentPin: '1234' } });
});

afterEach(() => { jest.useRealTimers(); });

describe('useParentGate', () => {
  it('verifyPin returns true for correct PIN', () => {
    const { result } = renderHook(() => useParentGate());
    expect(result.current.verifyPin('1234')).toBe(true);
  });

  it('verifyPin returns false for wrong PIN', () => {
    const { result } = renderHook(() => useParentGate());
    expect(result.current.verifyPin('9999')).toBe(false);
  });

  it('starts unlocked with failCount 0', () => {
    const { result } = renderHook(() => useParentGate());
    expect(result.current.failCount).toBe(0);
    expect(result.current.isLocked()).toBe(false);
  });

  it('locks after 3 wrong attempts', () => {
    const { result } = renderHook(() => useParentGate());
    act(() => { result.current.onWrongPin(); result.current.onWrongPin(); result.current.onWrongPin(); });
    expect(result.current.isLocked()).toBe(true);
  });

  it('unlocks after 30s', () => {
    const { result } = renderHook(() => useParentGate());
    act(() => { result.current.onWrongPin(); result.current.onWrongPin(); result.current.onWrongPin(); });
    act(() => { jest.advanceTimersByTime(31000); });
    expect(result.current.isLocked()).toBe(false);
  });
});
