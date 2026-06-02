import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import type { BreathCycle, BreathingExercise } from '../types';

interface BreathingPlayerState {
  currentPhase: BreathCycle;
  currentRound: number;
  totalRounds: number;
  progress: number;
  isPaused: boolean;
  isComplete: boolean;
  pauseResume: () => void;
  restart: () => void;
}

export function useBreathingPlayer(exercise: BreathingExercise): BreathingPlayerState {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const phaseIndexRef = useRef(0);
  const roundRef = useRef(1);
  const isPausedRef = useRef(false);
  const isCompleteRef = useRef(false);
  const phaseStartTimeRef = useRef<number>(Date.now());
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const scheduleNextPhase = useCallback(() => {
    if (isCompleteRef.current) return;
    const currentPhaseData = exercise.cycle[phaseIndexRef.current];
    const durationMs = currentPhaseData.durationSeconds * 1000;

    phaseStartTimeRef.current = Date.now();
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - phaseStartTimeRef.current;
      setProgress(Math.min(elapsed / durationMs, 1));
    }, 50);

    phaseTimeoutRef.current = setTimeout(() => {
      if (isPausedRef.current) return;
      const nextPhaseIndex = phaseIndexRef.current + 1;
      if (nextPhaseIndex >= exercise.cycle.length) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        const nextRound = roundRef.current + 1;
        if (nextRound > exercise.defaultCycles) {
          isCompleteRef.current = true;
          setIsComplete(true);
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          setProgress(1);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return;
        }
        roundRef.current = nextRound;
        setRound(nextRound);
        phaseIndexRef.current = 0;
        setPhaseIndex(0);
        setProgress(0);
        scheduleNextPhase();
      } else {
        phaseIndexRef.current = nextPhaseIndex;
        setPhaseIndex(nextPhaseIndex);
        setProgress(0);
        scheduleNextPhase();
      }
    }, durationMs);
  }, [exercise, clearTimers]);

  const startFresh = useCallback(() => {
    phaseIndexRef.current = 0;
    roundRef.current = 1;
    isPausedRef.current = false;
    isCompleteRef.current = false;
    setPhaseIndex(0);
    setRound(1);
    setIsPaused(false);
    setIsComplete(false);
    setProgress(0);
    scheduleNextPhase();
  }, [scheduleNextPhase]);

  useEffect(() => {
    startFresh();
    return () => { clearTimers(); };
  }, [startFresh, clearTimers]);

  const pauseResume = useCallback(() => {
    if (isCompleteRef.current) return;
    const nextPaused = !isPausedRef.current;
    isPausedRef.current = nextPaused;
    setIsPaused(nextPaused);
    if (nextPaused) {
      clearTimers();
    } else {
      scheduleNextPhase();
    }
  }, [clearTimers, scheduleNextPhase]);

  const restart = useCallback(() => {
    clearTimers();
    startFresh();
  }, [clearTimers, startFresh]);

  return {
    currentPhase: exercise.cycle[phaseIndex],
    currentRound: round,
    totalRounds: exercise.defaultCycles,
    progress,
    isPaused,
    isComplete,
    pauseResume,
    restart,
  };
}
