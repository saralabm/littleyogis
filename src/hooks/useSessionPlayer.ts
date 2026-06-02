import { useEffect, useRef, useCallback } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av';
import { useSessionStore } from '../store/useSessionStore';
import { useHaptics } from './useHaptics';

let cachedSound: Audio.Sound | null = null;

async function loadTransitionAudio(): Promise<Audio.Sound> {
  if (cachedSound) return cachedSound;
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/bell_end.mp3'),
      { shouldPlay: false }
    );
    cachedSound = sound;
    return sound;
  } catch {
    // Audio file not yet present — return a no-op stub
    return { replayAsync: async () => {}, unloadAsync: async () => {} } as unknown as Audio.Sound;
  }
}

export function useSessionPlayer() {
  const {
    session,
    currentStepIndex,
    secondsRemaining,
    isPaused,
    tickTimer,
    nextStep,
    startSession,
    pauseResume,
    prevStep,
    endSession,
  } = useSessionStore();

  const { poseStart, stepComplete } = useHaptics();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep screen awake
  useEffect(() => {
    activateKeepAwakeAsync();
    return () => { deactivateKeepAwake(); };
  }, []);

  // Timer interval
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => { tickTimer(); }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, tickTimer]);

  // Step completion
  useEffect(() => {
    if (secondsRemaining === 0 && session) {
      stepComplete();
      loadTransitionAudio().then((sound) => {
        sound.replayAsync().catch(() => {});
      });
      nextStep();
      poseStart();
    }
  }, [secondsRemaining]);

  const skipForward = useCallback(() => {
    nextStep();
    poseStart();
  }, [nextStep, poseStart]);

  const skipBack = useCallback(() => {
    prevStep();
    poseStart();
  }, [prevStep, poseStart]);

  const totalSteps = session?.steps.length ?? 0;
  const currentStep = session?.steps[currentStepIndex] ?? null;

  return {
    session,
    currentStep,
    currentStepIndex,
    totalSteps,
    secondsRemaining,
    isPaused,
    startSession,
    pauseResume,
    skipForward,
    skipBack,
    endSession,
  };
}
