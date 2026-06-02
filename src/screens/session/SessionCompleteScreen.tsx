import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Animated, AccessibilityInfo } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import type { Session } from '../../types';

type Nav = NativeStackNavigationProp<any>;
type Route = RouteProp<{ SessionComplete: { session: Session; stepsCompleted: number } }, 'SessionComplete'>;

const MOODS = ['😊', '🙂', '😐', '😕', '😔'];
const MOOD_LABELS = ['Amazing', 'Good', 'OK', 'Hard', 'Tough'];

export default function SessionCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { session, stepsCompleted } = route.params;

  const profile = useProfileStore((s) => s.profile);
  const { streakDays } = useProgressStore();
  const childName = profile?.preferredCharacterName ?? 'you';

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  const flashOpacity = useRef(new Animated.Value(0)).current;
  const yogiTranslateY = useRef(new Animated.Value(80)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const statsTranslateY = useRef(new Animated.Value(60)).current;
  const ratingOpacity = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      // Skip animation — show final state immediately
      bgOpacity.setValue(1);
      yogiTranslateY.setValue(0);
      titleScale.setValue(1);
      statsTranslateY.setValue(0);
      ratingOpacity.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 80, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(bgOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.timing(yogiTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(titleScale, { toValue: 1.0, duration: 300, useNativeDriver: true }),
      Animated.timing(statsTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(ratingOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }, 1200);
  }, [reduceMotion]);

  const durationMins = Math.round(session.totalDurationSeconds / 60);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Flash overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF', opacity: flashOpacity }]} pointerEvents="none" />

      {/* Warm bg */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFE0B2', opacity: bgOpacity }]} />

      <View style={styles.container}>
        {/* Confetti (reduce-motion: static stars) */}
        {reduceMotion ? (
          <Text style={styles.staticStars} accessibilityLabel="Celebration stars" accessibilityRole="image">⭐⭐⭐</Text>
        ) : (
          <Text style={styles.confetti}>🎉✨⭐🎊✨🎉</Text>
        )}

        {/* Yogi */}
        <Animated.View style={{ transform: [{ translateY: yogiTranslateY }] }}>
          <View style={styles.yogiPlaceholder}>
            <Text style={styles.yogiEmoji}>🥳</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[styles.title, { transform: [{ scale: titleScale }] }]}
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`You did it, ${childName}!`}
        >
          You Did It, {childName}! 🌟
        </Animated.Text>

        {/* Stats */}
        <Animated.View style={[styles.statsCard, { transform: [{ translateY: statsTranslateY }] }]}>
          <Text style={styles.statsText}>⏱ {durationMins} min  🧘 {stepsCompleted} steps</Text>
          <Text style={styles.statsSubtext}>completed today!</Text>
        </Animated.View>

        {/* Streak */}
        {streakDays >= 2 && (
          <Text style={styles.streakMsg}>🔥 {streakDays}-day streak! Keep going!</Text>
        )}

        {/* Mood rating */}
        <Animated.View style={{ opacity: ratingOpacity }}>
          <Text style={styles.ratingLabel}>How did that feel?</Text>
          <View style={styles.ratingRow}>
            {MOODS.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.moodBtn, selectedMood === i && styles.moodBtnSelected]}
                onPress={() => setSelectedMood(i)}
                accessibilityRole="button"
                accessibilityLabel={`Rate session: ${MOOD_LABELS[i]}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
                <Text style={styles.moodLabel}>{MOOD_LABELS[i]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text style={styles.homeBtnText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 12 },
  staticStars: { fontSize: 48, textAlign: 'center' },
  confetti: { fontSize: 32, textAlign: 'center' },
  yogiPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F9A825', alignItems: 'center', justifyContent: 'center' },
  yogiEmoji: { fontSize: 56 },
  title: { fontSize: 28, fontWeight: '700', color: '#1C1C2E', textAlign: 'center' },
  statsCard: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 20, alignItems: 'center', width: '100%' },
  statsText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
  statsSubtext: { fontSize: 14, color: '#7B7B99', marginTop: 4 },
  streakMsg: { fontSize: 16, fontWeight: '700', color: '#EF6C00' },
  ratingLabel: { fontSize: 16, fontWeight: '700', color: '#1C1C2E', textAlign: 'center', marginBottom: 12 },
  ratingRow: { flexDirection: 'row', gap: 12 },
  moodBtn: { alignItems: 'center', padding: 8 },
  moodBtnSelected: { borderWidth: 2, borderColor: '#FFF176', borderRadius: 12 },
  moodEmoji: { fontSize: 32 },
  moodLabel: { fontSize: 11, color: '#3D3D56', marginTop: 4 },
  homeBtn: { backgroundColor: '#F9A825', borderRadius: 100, paddingVertical: 16, paddingHorizontal: 40, marginTop: 8 },
  homeBtnText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
});
