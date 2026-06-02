import { useSessionStore } from '../../src/store/useSessionStore';
import type { Session } from '../../src/types';

const mockSession: Session = {
  id: 'session-1',
  ailmentId: 'constipation',
  ageTier: 'explorer',
  totalDurationSeconds: 300,
  steps: [
    { type: 'pose', poseId: 's1', durationSeconds: 30, instructionText: 'Cat-Cow' },
    { type: 'transition', durationSeconds: 3, instructionText: 'Next...' },
    { type: 'pose', poseId: 's2', durationSeconds: 30, instructionText: "Child's Pose" },
  ],
};

beforeEach(() => {
  useSessionStore.setState({
    session: null,
    currentStepIndex: 0,
    secondsRemaining: 0,
    isPaused: false,
  });
});

describe('useSessionStore', () => {
  it('starts with null session', () => {
    expect(useSessionStore.getState().session).toBeNull();
  });

  it('startSession initialises step 0', () => {
    useSessionStore.getState().startSession(mockSession);
    const s = useSessionStore.getState();
    expect(s.session).toEqual(mockSession);
    expect(s.currentStepIndex).toBe(0);
    expect(s.secondsRemaining).toBe(30);
    expect(s.isPaused).toBe(false);
  });

  it('nextStep advances to step 1', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().nextStep();
    expect(useSessionStore.getState().currentStepIndex).toBe(1);
    expect(useSessionStore.getState().secondsRemaining).toBe(3);
  });

  it('nextStep does not advance past last step', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().nextStep();
    useSessionStore.getState().nextStep();
    useSessionStore.getState().nextStep(); // beyond last
    expect(useSessionStore.getState().currentStepIndex).toBe(2);
  });

  it('prevStep goes back to step 0', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().nextStep();
    useSessionStore.getState().prevStep();
    expect(useSessionStore.getState().currentStepIndex).toBe(0);
    expect(useSessionStore.getState().secondsRemaining).toBe(30);
  });

  it('prevStep is a no-op at step 0', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().prevStep();
    expect(useSessionStore.getState().currentStepIndex).toBe(0);
  });

  it('pauseResume toggles isPaused', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().pauseResume();
    expect(useSessionStore.getState().isPaused).toBe(true);
    useSessionStore.getState().pauseResume();
    expect(useSessionStore.getState().isPaused).toBe(false);
  });

  it('tickTimer decrements secondsRemaining', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().tickTimer();
    expect(useSessionStore.getState().secondsRemaining).toBe(29);
  });

  it('tickTimer does not tick when paused', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().pauseResume();
    useSessionStore.getState().tickTimer();
    expect(useSessionStore.getState().secondsRemaining).toBe(30);
  });

  it('tickTimer does not go below zero', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.setState({ secondsRemaining: 0 });
    useSessionStore.getState().tickTimer();
    expect(useSessionStore.getState().secondsRemaining).toBe(0);
  });

  it('endSession resets all state', () => {
    useSessionStore.getState().startSession(mockSession);
    useSessionStore.getState().endSession();
    const s = useSessionStore.getState();
    expect(s.session).toBeNull();
    expect(s.currentStepIndex).toBe(0);
    expect(s.secondsRemaining).toBe(0);
  });
});
