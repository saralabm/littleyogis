import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import { useSessionStore } from '../../store/useSessionStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useSessionPlayer } from '../../hooks/useSessionPlayer';
import { HoldTimer } from '../../components/session/HoldTimer';
import { PoseDisplay } from '../../components/session/PoseDisplay';
import { TransitionOverlay } from '../../components/session/TransitionOverlay';
import { ContraindicationAlert } from '../../components/session/ContraindicationAlert';
import { PoseInstructions } from '../../components/session/PoseInstructions';
import { ProgressBar } from '../../components/atoms/ProgressBar';
import { poseName } from '../../utils/poseNameUtils';
import { useAgeTheme } from '../../features/age-adaptive/useAgeTheme';
import type { Session } from '../../types';

type Nav = NativeStackNavigationProp<any>;
type Route = RouteProp<{ SessionPlayer: { session: Session } }, 'SessionPlayer'>;

const EMPTY_POSE = {
  id: '', englishName: '', sanskritName: '', howItHelps: '',
  ageSuitability: 'both' as const, holdTimeBreaths: { min: 0, max: 0 },
  contraindications: [], lottieAsset: '', thumbnailAsset: '',
};

export default function SessionPlayerScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { session } = route.params;

  const profile = useProfileStore((s) => s.profile);
  const tier = profile?.tier ?? 'explorer';
  const { timerStyle, autoAdvanceSession, instructionFontSize } = useAgeTheme();

  const { startSession, endSession } = useSessionStore();
  const recordCompletion = useProgressStore((s) => s.recordCompletion);

  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    secondsRemaining,
    isPaused,
    pauseResume,
    skipForward,
    skipBack,
  } = useSessionPlayer();

  const seenContraindications = useRef(new Set<string>());
  const [showContra, setShowContra] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const isComplete = currentStepIndex >= totalSteps && totalSteps > 0;

  // Start session on mount
  useEffect(() => {
    startSession(session);
  }, []);

  // Navigate to complete when done
  useEffect(() => {
    if (isComplete) {
      recordCompletion({
        sessionId: session.id,
        ailmentId: session.ailmentId,
        completedAt: Date.now(),
        durationSeconds: session.totalDurationSeconds,
        stepsCompleted: totalSteps,
        totalSteps,
      });
      navigation.replace('SessionComplete', { session, stepsCompleted: totalSteps });
    }
  }, [isComplete]);

  // Show contraindication alert for pose steps (once per pose)
  useEffect(() => {
    if (currentStep?.type === 'pose' && currentStep.poseId) {
      const pose = session.steps[currentStepIndex];
      if (pose?.type === 'pose' && pose.poseId && !seenContraindications.current.has(pose.poseId)) {
        const fullPose = session.steps.find((s) => s.poseId === pose.poseId);
        if (fullPose) {
          seenContraindications.current.add(pose.poseId);
          setShowContra(true);
        }
      }
    }
  }, [currentStepIndex]);

  // Auto-advance for seedling tier
  useEffect(() => {
    if (autoAdvanceSession && secondsRemaining === 0 && !isComplete) {
      skipForward();
    }
  }, [secondsRemaining, autoAdvanceSession]);

  function handleQuit() {
    Alert.alert('End Session?', 'Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End', style: 'destructive', onPress: () => { endSession(); navigation.goBack(); } },
    ]);
  }

  const isTransition = currentStep?.type === 'transition';
  const nextStep = session.steps[currentStepIndex + 1];
  const nextPoseName = nextStep?.type === 'pose' && nextStep.poseId
    ? nextStep.poseId.replace(/-/g, ' ')
    : 'next pose';

  // Find the actual pose object from the step (simplified — uses poseId as display)
  const currentPose = currentStep?.type === 'pose' ? {
    ...EMPTY_POSE,
    id: currentStep.poseId ?? '',
    englishName: currentStep.poseId?.replace(/-/g, ' ') ?? '',
    sanskritName: '',
    howItHelps: currentStep.instructionText,
  } : EMPTY_POSE;

  const totalDuration = currentStep?.durationSeconds ?? 1;
  const breathsTotal = Math.max(1, Math.round(totalDuration / 4));
  const breathsDone = Math.max(0, breathsTotal - Math.round(secondsRemaining / 4));
  const fillProgress = totalSteps > 0 ? currentStepIndex / totalSteps : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Progress bar */}
        <ProgressBar fill={fillProgress} style={styles.progressBar} color="#80CBC4" />

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.quitBtn} onPress={handleQuit} accessibilityRole="button" accessibilityLabel="Quit session" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.quitText}>✕ Quit</Text>
          </TouchableOpacity>
          <Text style={styles.stepCount}>{Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}</Text>
          <TouchableOpacity style={styles.audioBtn} onPress={() => setAudioEnabled(!audioEnabled)} accessibilityRole="button" accessibilityLabel={audioEnabled ? 'Mute audio' : 'Unmute audio'} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.audioIcon}>{audioEnabled ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
        </View>

        {/* Main pose display */}
        <View style={styles.poseContainer}>
          {!isTransition && currentStep?.type === 'pose' && (
            <PoseDisplay pose={currentPose} tier={tier} />
          )}
        </View>

        {/* Timer */}
        {!isTransition && (
          <HoldTimer
            totalSeconds={totalDuration}
            secondsRemaining={secondsRemaining}
            breathsTotal={breathsTotal}
            breathsDone={breathsDone}
            tier={tier}
          />
        )}

        {/* Instructions */}
        {!isTransition && currentStep?.type === 'pose' && (
          <PoseInstructions pose={currentPose} tier={tier} />
        )}

        {/* Breathing cue */}
        <View style={styles.cueBanner}>
          <Text style={[styles.cueText, { fontSize: instructionFontSize }]} accessibilityLiveRegion={secondsRemaining <= 5 ? 'assertive' : 'none'}>
            {isTransition ? currentStep?.instructionText : `${secondsRemaining}s remaining`}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={skipBack} accessibilityRole="button" accessibilityLabel="Previous pose" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.controlIcon}>◀◀</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlBtn, styles.pauseBtn]} onPress={pauseResume} accessibilityRole="button" accessibilityLabel={isPaused ? 'Resume session' : 'Pause session'}>
            <Text style={styles.pauseIcon}>{isPaused ? '▶' : '⏸'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={skipForward} accessibilityRole="button" accessibilityLabel="Next pose" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.controlIcon}>▶▶</Text>
          </TouchableOpacity>
        </View>

        {/* Transition overlay */}
        <TransitionOverlay nextPoseName={nextPoseName} visible={isTransition} />

        {/* Contraindication alert */}
        <ContraindicationAlert pose={currentPose} visible={showContra} onDismiss={() => setShowContra(false)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { flex: 1, position: 'relative' },
  progressBar: { marginHorizontal: 0, borderRadius: 0, height: 4 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  quitBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  quitText: { color: 'rgba(240,240,255,0.7)', fontSize: 16 },
  stepCount: { flex: 1, textAlign: 'center', color: 'rgba(240,240,255,0.7)', fontSize: 16 },
  audioBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'flex-end' },
  audioIcon: { fontSize: 20 },
  poseContainer: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  cueBanner: { paddingHorizontal: 20, paddingVertical: 8, alignItems: 'center' },
  cueText: { color: 'rgba(240,240,255,0.7)', fontSize: 14, textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 20 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pauseBtn: { backgroundColor: '#F9A825' },
  controlIcon: { color: '#F0F0FF', fontSize: 16 },
  pauseIcon: { color: '#1C1C2E', fontSize: 18 },
});
