import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import { getAilmentById, getBreathingById } from '../../data/index';
import { PoseCard } from '../../components/molecules/PoseCard';
import { BreathingCard } from '../../components/molecules/BreathingCard';
import { SafetyBanner } from '../../components/molecules/SafetyBanner';
import { useProfileStore } from '../../store/useProfileStore';
import { buildSession } from '../../utils/buildSession';
import { poseName } from '../../utils/poseNameUtils';
import { useAgeTheme } from '../../features/age-adaptive/useAgeTheme';
import { useAgeContent } from '../../features/age-adaptive/useAgeContent';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Nav = NativeStackNavigationProp<any>;
type Route = RouteProp<{ AilmentDetail: { ailmentId: string } }, 'AilmentDetail'>;

export default function AilmentDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { ailmentId } = route.params;
  const profile = useProfileStore((s) => s.profile);

  const ailment = useMemo(() => getAilmentById(ailmentId), [ailmentId]);
  const recommendedBreathing = useMemo(
    () => ailment?.recommendedBreathingIds[0] ? getBreathingById(ailment.recommendedBreathingIds[0]) : null,
    [ailment]
  );

  const tier = profile?.tier ?? 'explorer';

  const { bodyFontSize, instructionFontSize } = useAgeTheme();
  const { filterPosesForTier, getPoseName } = useAgeContent();

  const filteredPoses = useMemo(() => filterPosesForTier(ailment?.poses ?? []), [ailment, filterPosesForTier]);

  const estimatedMins = Math.round((filteredPoses.length * 2.5));
  const difficulty = tier === 'seedling' ? 'Easy' : tier === 'yogi' ? 'Full' : 'Moderate';

  function handleStartSession() {
    if (!ailment || !profile) return;
    const session = buildSession(ailment, profile);
    navigation.navigate('SessionPlayer', { session });
  }

  if (!ailment) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Ailment not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backBtnText}>‹ Back</Text>
      </TouchableOpacity>

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: ailment.accentColor }]}>
        <Text style={styles.heroEmoji}>{ailment.emoji}</Text>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{ailment.childFriendlyName}</Text>
        <Text style={styles.subtitle}>{ailment.displayName}</Text>

        {/* Chips */}
        <View style={styles.chips}>
          <View style={styles.chip}><Text style={styles.chipText}>⏱ {estimatedMins}min</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>🧘 {filteredPoses.length} poses</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>{difficulty}</Text></View>
        </View>

        {/* Did you know */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>💡 Did you know?</Text>
          <Text style={[styles.infoText, { fontSize: bodyFontSize }]}>{ailment.shortDescription}</Text>
        </View>

        {/* Poses */}
        <Text style={styles.sectionLabel}>Today's Poses</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.poseScroll}>
          {filteredPoses.map((pose) => (
            <PoseCard
              key={pose.id}
              pose={pose}
              ageTier={tier}
              displayName={getPoseName(pose)}
            />
          ))}
        </ScrollView>

        {/* Recommended breathing */}
        {recommendedBreathing && (
          <>
            <Text style={styles.sectionLabel}>Breathing to Try</Text>
            <BreathingCard
              exercise={recommendedBreathing}
              onPress={() => navigation.navigate('Breathe', { screen: 'BreathingPlayer', params: { exerciseId: recommendedBreathing.id } })}
            />
          </>
        )}

        {/* Safety banner */}
        {ailment.safetyNote && (
          <SafetyBanner
            message={ailment.safetyNote}
            collapsible={!ailment.alwaysShowSafetyBanner}
          />
        )}

        {/* Start session CTA */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={handleStartSession}
          accessibilityRole="button"
          accessibilityLabel={`Start ${ailment.childFriendlyName} session`}
        >
          <Text style={styles.startBtnText}>▶  Start Session ({estimatedMins} min)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { fontSize: 18, color: colors.text.primary },
  backLink: { fontSize: 16, color: '#42A5F5', textDecorationLine: 'underline' },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10, padding: 8 },
  backBtnText: { fontSize: 18, color: colors.bg.card, fontWeight: '600' },
  hero: { height: 200, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 80 },
  content: { paddingHorizontal: spacing.screenPaddingH, paddingTop: 16, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.text.muted, marginBottom: 12 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  chip: { backgroundColor: '#F0F0F8', borderRadius: spacing.buttonRadius, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text.body },
  infoCard: { backgroundColor: colors.bg.card, borderRadius: 16, padding: spacing.cardPadding, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  infoLabel: { fontSize: 13, fontWeight: '700', color: colors.primary.sunshine, marginBottom: 6 },
  infoText: { fontSize: 16, color: colors.text.body, lineHeight: 24 },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 8, marginTop: 8 },
  poseScroll: { gap: 12, paddingBottom: 4, paddingRight: 4 },
  startBtn: { backgroundColor: colors.primary.sunshine, borderRadius: spacing.buttonRadius, paddingVertical: 18, alignItems: 'center', marginTop: 24, minHeight: spacing.minTouchTarget, justifyContent: 'center', shadowColor: colors.primary.sunshine, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  startBtnText: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
});
