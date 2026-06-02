import { useProgressStore } from '../../src/store/useProgressStore';
import type { CompletedSession } from '../../src/types';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
}));

function dayMs(daysAgo: number): number {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(12, 0, 0, 0);
  return d.getTime();
}

function makeRecord(daysAgo: number, id = `s${daysAgo}`): CompletedSession {
  return {
    sessionId: id,
    ailmentId: 'constipation',
    completedAt: dayMs(daysAgo),
    durationSeconds: 900,
    stepsCompleted: 6,
    totalSteps: 6,
  };
}

beforeEach(() => {
  useProgressStore.setState({
    completedSessions: [],
    streakDays: 0,
    lastPracticedAt: null,
  });
});

describe('useProgressStore', () => {
  it('starts empty', () => {
    const s = useProgressStore.getState();
    expect(s.completedSessions).toHaveLength(0);
    expect(s.streakDays).toBe(0);
    expect(s.lastPracticedAt).toBeNull();
  });

  it('recordCompletion appends and updates lastPracticedAt', () => {
    const record = makeRecord(0);
    useProgressStore.getState().recordCompletion(record);
    const s = useProgressStore.getState();
    expect(s.completedSessions).toHaveLength(1);
    expect(s.lastPracticedAt).toBe(record.completedAt);
  });

  it('streak is 1 for a single session today', () => {
    useProgressStore.getState().recordCompletion(makeRecord(0));
    expect(useProgressStore.getState().streakDays).toBe(1);
  });

  it('streak is 3 for 3 consecutive days', () => {
    useProgressStore.getState().recordCompletion(makeRecord(2, 'a'));
    useProgressStore.getState().recordCompletion(makeRecord(1, 'b'));
    useProgressStore.getState().recordCompletion(makeRecord(0, 'c'));
    expect(useProgressStore.getState().streakDays).toBe(3);
  });

  it('streak breaks on a missed day', () => {
    useProgressStore.getState().recordCompletion(makeRecord(3, 'a'));
    useProgressStore.getState().recordCompletion(makeRecord(1, 'b'));
    useProgressStore.getState().recordCompletion(makeRecord(0, 'c'));
    expect(useProgressStore.getState().streakDays).toBe(2);
  });

  it('streak is 0 if last session was 2+ days ago', () => {
    useProgressStore.getState().recordCompletion(makeRecord(2));
    expect(useProgressStore.getState().streakDays).toBe(0);
  });

  it('calculateStreak recomputes from stored sessions', () => {
    useProgressStore.setState({
      completedSessions: [makeRecord(1, 'a'), makeRecord(0, 'b')],
      streakDays: 99,
      lastPracticedAt: dayMs(0),
    });
    useProgressStore.getState().calculateStreak();
    expect(useProgressStore.getState().streakDays).toBe(2);
  });
});
