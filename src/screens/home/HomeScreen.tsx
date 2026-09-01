import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useAgeTheme } from '../../features/age-adaptive/useAgeTheme';

type Nav = NativeStackNavigationProp<any>;

const MOODS = [
  { emoji: '😊', label: 'Happy',   ailmentId: null },
  { emoji: '😤', label: 'Grumpy',  ailmentId: 'anger' },
  { emoji: '😔', label: 'Sad',     ailmentId: 'low-confidence' },
  { emoji: '😰', label: 'Worried', ailmentId: 'anxiety' },
  { emoji: '😴', label: 'Sleepy',  ailmentId: 'sleep-issues' },
  { emoji: '🤕', label: 'Hurty',   ailmentId: null },
];

const BODY_MAP = [
  { icon: '👀', label: 'Head',          ailmentId: 'headaches' },
  { icon: '🫁', label: 'Chest/Breath',  ailmentId: 'asthma' },
  { icon: '🤸', label: 'Tummy',         ailmentId: 'constipation' },
  { icon: '💪', label: 'Back',          ailmentId: 'poor-posture' },
  { icon: '🦵', label: 'Legs',          ailmentId: 'tight-hamstrings' },
  { icon: '🔋', label: 'Low Energy',    ailmentId: 'low-energy' },
  { icon: '⚖️', label: 'Strength',      ailmentId: 'weight-support' },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useProfileStore((s) => s.profile);
  const streak = useProgressStore((s) => s.streakDays);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showPinGate, setShowPinGate] = useState(false);
  const { backgroundColor, showStreak, showYogi, yogiSize, bodyFontSize } = useAgeTheme();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const name = profile?.preferredCharacterName ?? 'there';

  function handleMood(mood: typeof MOODS[0]) {
    setSelectedMood(mood.emoji);
    if (mood.ailmentId) {
      navigation.navigate('Explore', {
        screen: 'AilmentDetail',
        params: { ailmentId: mood.ailmentId },
      });
    } else if (mood.label === 'Hurty') {
      navigation.navigate('Explore', {
        screen: 'CategoryBrowser',
        params: { initialCategory: 'physical' },
      });
    } else if (mood.label === 'Happy') {
      navigation.navigate('Explore', { screen: 'CategoryBrowser' });
    }
  }

  function handleBodyZone(ailmentId: string) {
    navigation.navigate('Explore', {
      screen: 'AilmentDetail',
      params: { ailmentId },
    });
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting}, {name}! 🌤️</Text>
          {showStreak && streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak}</Text>
            </View>
          )}
        </View>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => setShowPinGate(true)}
          accessibilityRole="button"
          accessibilityLabel="Parent settings"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>

      {/* Yogi placeholder */}
      {showYogi && (
        <View style={[styles.yogiPlaceholder, { width: yogiSize, height: yogiSize, borderRadius: yogiSize / 2 }]}>
          <Text style={[styles.yogiEmoji, { fontSize: yogiSize * 0.48 }]}>🧘</Text>
        </View>
      )}

      {/* Mood selector */}
      <Text style={[styles.sectionTitle, { fontSize: bodyFontSize + 2 }]}>How are you feeling today?</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => (
          <Pressable
            key={mood.emoji}
            style={[styles.moodBtn, selectedMood === mood.emoji && styles.moodBtnSelected]}
            onPress={() => handleMood(mood)}
            accessibilityRole="button"
            accessibilityLabel={`${mood.label} mood`}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />
      <Text style={[styles.sectionTitle, { fontSize: bodyFontSize + 2 }]}>Does something feel sore?</Text>

      {/* Body map */}
      <View style={styles.bodyMap}>
        {BODY_MAP.map((zone) => (
          <Pressable
            key={zone.ailmentId}
            style={styles.bodyRow}
            onPress={() => handleBodyZone(zone.ailmentId)}
            accessibilityRole="button"
            accessibilityLabel={`Body area: ${zone.label}`}
          >
            <Text style={styles.bodyIcon}>{zone.icon}</Text>
            <Text style={styles.bodyLabel}>{zone.label}</Text>
            <Text style={styles.bodyChevron}>›</Text>
          </Pressable>
        ))}
      </View>

      {/* Quick access */}
      <Text style={styles.sectionTitle}>Quick access</Text>
      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quickTile}
          onPress={() => navigation.navigate('Breathe', { screen: 'BreathingLibrary' })}
          accessibilityRole="button"
          accessibilityLabel="Breathing exercises"
        >
          <Text style={styles.quickIcon}>🌬️</Text>
          <Text style={styles.quickLabel}>Breathing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickTile}
          onPress={() => navigation.navigate('Explore', { screen: 'AilmentDetail', params: { ailmentId: 'sleep-issues' } })}
          accessibilityRole="button"
          accessibilityLabel="Bedtime yoga"
        >
          <Text style={styles.quickIcon}>😴</Text>
          <Text style={styles.quickLabel}>Bedtime</Text>
        </TouchableOpacity>
      </View>

      {/* Explore All */}
      <TouchableOpacity
        style={styles.exploreAllBtn}
        onPress={() => navigation.navigate('Explore', { screen: 'CategoryBrowser' })}
        accessibilityRole="button"
        accessibilityLabel="Explore all yoga sessions"
      >
        <Text style={styles.exploreAllText}>Explore All Yoga Sessions →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF2' },
  content: { paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#1C1C2E', flex: 1 },
  streakBadge: { backgroundColor: '#FFF3E0', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  streakText: { fontSize: 14, fontWeight: '700', color: '#F9A825' },
  settingsBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 22 },
  yogiPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F9A825', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  yogiEmoji: { fontSize: 48 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C2E', paddingHorizontal: 20, marginBottom: 12, marginTop: 8 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 20, marginBottom: 16 },
  moodBtn: { alignItems: 'center', minWidth: 44, padding: 4 },
  moodBtnSelected: { opacity: 0.7 },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontSize: 11, color: '#7B7B99', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginHorizontal: 20, marginVertical: 16 },
  bodyMap: { marginHorizontal: 20, borderRadius: 16, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bodyRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', minHeight: 60 },
  bodyIcon: { fontSize: 24, marginRight: 12 },
  bodyLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1C1C2E' },
  bodyChevron: { fontSize: 20, color: '#7B7B99' },
  quickRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 8 },
  quickTile: { flex: 1, height: 72, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, gap: 4 },
  quickIcon: { fontSize: 24 },
  quickLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C2E' },
  exploreAllBtn: { marginHorizontal: 20, marginTop: 16, borderWidth: 2, borderColor: '#F9A825', borderRadius: 100, paddingVertical: 14, alignItems: 'center' },
  exploreAllText: { fontSize: 16, fontWeight: '700', color: '#F9A825' },
});
