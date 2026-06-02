import { create } from 'zustand';
import { Session, SessionStep } from '../types';

interface SessionState {
  session: Session | null;
  currentStepIndex: number;
  secondsRemaining: number;
  isPaused: boolean;
  startSession: (session: Session) => void;
  nextStep: () => void;
  prevStep: () => void;
  pauseResume: () => void;
  tickTimer: () => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  session: null,
  currentStepIndex: 0,
  secondsRemaining: 0,
  isPaused: false,

  startSession: (session) =>
    set({
      session,
      currentStepIndex: 0,
      secondsRemaining: session.steps[0]?.durationSeconds ?? 0,
      isPaused: false,
    }),

  nextStep: () => {
    const { session, currentStepIndex } = get();
    if (!session) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= session.steps.length) return;
    set({
      currentStepIndex: nextIndex,
      secondsRemaining: session.steps[nextIndex].durationSeconds,
      isPaused: false,
    });
  },

  prevStep: () => {
    const { session, currentStepIndex } = get();
    if (!session || currentStepIndex === 0) return;
    const prevIndex = currentStepIndex - 1;
    set({
      currentStepIndex: prevIndex,
      secondsRemaining: session.steps[prevIndex].durationSeconds,
      isPaused: false,
    });
  },

  pauseResume: () => set((state) => ({ isPaused: !state.isPaused })),

  tickTimer: () => {
    const { secondsRemaining, isPaused } = get();
    if (isPaused || secondsRemaining <= 0) return;
    set({ secondsRemaining: secondsRemaining - 1 });
  },

  endSession: () =>
    set({
      session: null,
      currentStepIndex: 0,
      secondsRemaining: 0,
      isPaused: false,
    }),
}));
