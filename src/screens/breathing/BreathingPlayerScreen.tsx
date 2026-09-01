import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import { getBreathingById } from '../../data/index';
import { useBreathingPlayer } from '../../hooks/useBreathingPlayer';
import { BreathingCircle } from '../../components/breathing/BreathingCircle';
import { BreathPhaseArc } from '../../components/breathing/BreathPhaseArc';
import { BreathCounter } from '../../components/breathing/BreathCounter';
import { ProgressBar } from '../../components/atoms/ProgressBar';

type Nav = NativeStackNavigationProp<any>;
type Route = RouteProp<{ BreathingPlayer: { exerciseId: string } }, 'BreathingPlayer'>;

function BreathingPlayerContent({ navigation, exerciseId }: { navigation: Nav; exerciseId: string }) {
  const exercise = getBreathingById(exerciseId)!;
  const {
    currentPhase, currentRound, totalRounds, progress,
    isPaused, isComplete, pauseResume, restart, skipRound,
  } = useBreathingPlayer(exercise);

  const [countCue, setCountCue] = useState(1);
  const countOpacity = useRef(new Animated.Value(1)).current;
  const currentPhaseIdx = exercise.cycle.findIndex((c) => c.phase === currentPhase.phase);

  useEffect(() => {
    if (isComplete) {
      navigation.navigate('BreathingComplete', {
        exerciseName: exercise.kidFriendlyName,
        roundsCompleted: totalRounds,
      });
    }
  }, [isComplete]);

  useEffect(() => {
    if (isPaused || isComplete) return;
    setCountCue(1);
    const interval = setInterval(() => {
      setCountCue((c) => c < currentPhase.durationSeconds ? c + 1 : 1);
      countOpacity.setValue(0.3);
      Animated.timing(countOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPhase, isPaused, isComplete]);

  const roundProgress = totalRounds > 0 ? (currentRound - 1) / totalRounds : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View testID="breathing-player-screen" style={styles.container}>
        {/* Progress */}
        <ProgressBar fill={roundProgress} style={styles.progressBar} color="#80CBC4" />
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back to breathing library"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.roundLabel}>Round {currentRound}/{totalRounds}</Text>
        </View>

        <Text style={styles.exerciseName}>{exercise.kidFriendlyName}</Text>

        {/* Circle */}
        <View style={styles.circleContainer}>
          <BreathingCircle phase={currentPhase} progress={progress} size={280} />
        </View>

        {/* Arc */}
        <BreathPhaseArc exercise={exercise} currentPhaseIndex={currentPhaseIdx >= 0 ? currentPhaseIdx : 0} phaseProgress={progress} />

        {/* Breath counter */}
        <BreathCounter current={currentRound - 1} total={totalRounds} />

        {/* Count cue */}
        <Animated.Text style={[styles.countCue, { opacity: countOpacity }]}>
          {Array.from({ length: countCue }, (_, i) => `${i + 1}...`).join(' ')}
        </Animated.Text>

        {/* Instructions */}
        <Text style={styles.instruction} numberOfLines={2}>{exercise.instructions[0]}</Text>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={restart} accessibilityRole="button" accessibilityLabel="Restart exercise" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.controlIcon}>⟪</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="pause-button"
            style={[styles.controlBtn, styles.pauseBtn]}
            onPress={pauseResume}
            accessibilityRole="button"
            accessibilityLabel={isPaused ? 'Resume breathing exercise' : 'Pause breathing exercise'}
          >
            <Text style={styles.pauseIcon}>{isPaused ? '▶' : '⏸'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={skipRound} accessibilityRole="button" accessibilityLabel="Skip to next round" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.controlIcon}>⟫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function BreathingPlayerScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { exerciseId } = route.params;

  if (!getBreathingById(exerciseId)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#F0F0FF' }}>Exercise not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#80CBC4', marginTop: 16 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return <BreathingPlayerContent navigation={navigation} exerciseId={exerciseId} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  progressBar: { width: '100%', marginBottom: 4, borderRadius: 0, height: 4 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  backBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  backText: { color: 'rgba(240,240,255,0.7)', fontSize: 18 },
  roundLabel: { color: 'rgba(240,240,255,0.7)', fontSize: 16 },
  exerciseName: { fontSize: 22, fontWeight: '700', color: '#F0F0FF', textAlign: 'center' },
  circleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', maxHeight: '40%' },
  countCue: { fontSize: 18, fontWeight: '700', color: '#FFF176' },
  instruction: { fontSize: 16, color: 'rgba(240,240,255,0.6)', textAlign: 'center', paddingHorizontal: 20 },
  controls: { flexDirection: 'row', gap: 24, paddingBottom: 16 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pauseBtn: { backgroundColor: '#F9A825' },
  controlIcon: { color: '#F0F0FF', fontSize: 20 },
  pauseIcon: { color: '#1C1C2E', fontSize: 20 },
});
