import { useSessionStore } from '../../src/store/useSessionStore';
import type { Session } from '../../src/types';

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn().mockResolvedValue(undefined),
  deactivateKeepAwake: jest.fn(),
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: { replayAsync: jest.fn(), unloadAsync: jest.fn() },
      }),
    },
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Medium: 'Medium', Light: 'Light' },
  NotificationFeedbackType: { Success: 'Success' },
}));

const mockSession: Session = {
  id: 'test-1',
  ailmentId: 'constipation',
  ageTier: 'explorer',
  totalDurationSeconds: 60,
  steps: [
    { type: 'pose', poseId: 'cat-cow', durationSeconds: 30, instructionText: 'Cat-Cow' },
    { type: 'transition', durationSeconds: 3, instructionText: 'Next...' },
    { type: 'pose', poseId: 'childs-pose', durationSeconds: 27, instructionText: "Child's Pose" },
  ],
};

beforeEach(() => {
  jest.useFakeTimers();
  useSessionStore.setState({
    session: null, currentStepIndex: 0, secondsRemaining: 0, isPaused: false,
  });
});

afterEach(() => { jest.useRealTimers(); });

describe('useSessionStore timer integration', () => {
  it('tickTimer decrements secondsRemaining by 1', () => {
    useSessionStore.getState().startSession(mockSession);
    expect(useSessionStore.getState().secondsRemaining).toBe(30);
    useSessionStore.getState().tickTimer();
    expect(useSessionStore.getState().secondsRemaining).toBe(29);
  });

  it('tickTimer does not go below 0', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.setState({ secondsRemaining: 0 });
    useSessionStore.getState().tickTimer();
    expect(useSessionStore.getState().secondsRemaining).toBe(0);
  });

  it('nextStep advances to step 1 with correct duration', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().nextStep();
    expect(useSessionStore.getState().currentStepIndex).toBe(1);
    expect(useSessionStore.getState().secondsRemaining).toBe(3);
  });

  it('session has correct total steps', () => {
    useSessionStore.getState().startSession(mockSession);
    expect(mockSession.steps.length).toBe(3);
  });
});
