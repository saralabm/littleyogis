import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedSession } from '../types';

interface ProgressState {
  completedSessions: CompletedSession[];
  streakDays: number;
  lastPracticedAt: number | null;
  recordCompletion: (record: CompletedSession) => void;
  updateSessionMoodRating: (sessionId: string, rating: number) => void;
  calculateStreak: () => void;
}

function startOfDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function computeStreak(sessions: CompletedSession[]): number {
  if (sessions.length === 0) return 0;

  const days = Array.from(
    new Set(sessions.map((s) => startOfDay(s.completedAt))),
  ).sort((a, b) => b - a);

  const todayStart = startOfDay(Date.now());
  const yesterdayStart = todayStart - 86_400_000;

  if (days[0] < yesterdayStart) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i - 1] - days[i] === 86_400_000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedSessions: [],
      streakDays: 0,
      lastPracticedAt: null,

      recordCompletion: (record) => {
        const updated = [...get().completedSessions, record];
        set({
          completedSessions: updated,
          streakDays: computeStreak(updated),
          lastPracticedAt: record.completedAt,
        });
      },

      updateSessionMoodRating: (sessionId, rating) => {
        const updated = get().completedSessions.map((s) =>
          s.id === sessionId ? { ...s, moodRating: rating } : s,
        );
        set({ completedSessions: updated });
      },

      calculateStreak: () => {
        set({ streakDays: computeStreak(get().completedSessions) });
      },
    }),
    {
      name: 'healingstars-progress',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
