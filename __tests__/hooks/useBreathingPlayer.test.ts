import { renderHook, act } from '@testing-library/react-native';
import { useBreathingPlayer } from '../../src/hooks/useBreathingPlayer';
import type { BreathingExercise } from '../../src/types';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'Light' },
  NotificationFeedbackType: { Success: 'Success' },
}));

const twoPhase: BreathingExercise = {
  id: 'test', kidFriendlyName: 'Test', traditionalName: 'Test',
  ageSuitability: 'both', defaultCycles: 2, emoji: '✅',
  cycle: [
    { phase: 'inhale', durationSeconds: 1, label: 'In', animationState: 'expand' },
    { phase: 'exhale', durationSeconds: 1, label: 'Out', animationState: 'contract' },
  ],
  whatItHelps: ['calm'], instructions: ['Test'],
  gradientColors: ['#81C784', '#A5D6A7'],
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => { jest.useRealTimers(); });

describe('useBreathingPlayer', () => {
  it('starts with phase 0, round 1, not paused, not complete', () => {
    const { result } = renderHook(() => useBreathingPlayer(twoPhase));
    expect(result.current.currentPhase).toEqual(twoPhase.cycle[0]);
    expect(result.current.currentRound).toBe(1);
    expect(result.current.totalRounds).toBe(2);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isComplete).toBe(false);
  });

  it('advances to phase 1 after 1000ms', () => {
    const { result } = renderHook(() => useBreathingPlayer(twoPhase));
    act(() => { jest.advanceTimersByTime(1100); });
    expect(result.current.currentPhase).toEqual(twoPhase.cycle[1]);
  });

  it('increments round after full cycle', () => {
    const { result } = renderHook(() => useBreathingPlayer(twoPhase));
    act(() => { jest.advanceTimersByTime(2100); });
    expect(result.current.currentRound).toBe(2);
  });

  it('sets isComplete after all rounds', () => {
    const { result } = renderHook(() => useBreathingPlayer(twoPhase));
    act(() => { jest.advanceTimersByTime(4200); });
    expect(result.current.isComplete).toBe(true);
  });

  it('pauseResume toggles isPaused', () => {
    const { result } = renderHook(() => useBreathingPlayer(twoPhase));
    act(() => { result.current.pauseResume(); });
    expect(result.current.isPaused).toBe(true);
    act(() => { result.current.pauseResume(); });
    expect(result.current.isPaused).toBe(false);
  });

  it('restart resets to initial state', () => {
    const { result } = renderHook(() => useBreathingPlayer(twoPhase));
    act(() => { jest.advanceTimersByTime(2100); });
    act(() => { result.current.restart(); });
    expect(result.current.currentRound).toBe(1);
    expect(result.current.isComplete).toBe(false);
  });
});
