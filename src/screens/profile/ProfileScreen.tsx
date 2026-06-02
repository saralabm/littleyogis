import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import { PinGate } from '../../components/molecules/PinGate';
import { DisclaimerSheet } from '../../components/molecules/DisclaimerSheet';
import type { AgeTier } from '../../types';

type Nav = NativeStackNavigationProp<any>;

const TIERS: { tier: AgeTier; label: string; range: string; accent: string }[] = [
  { tier: 'seedling', label: 'Little Yogi', range: '4–6', accent: '#FFB300' },
  { tier: 'explorer', label: 'Explorer', range: '7–9', accent: '#558B2F' },
  { tier: 'yogi', label: 'Warrior', range: '10–12', accent: '#3949AB' },
];

const DISCLAIMER_BODY = `LittleYogi provides general wellness movement and breathing content for educational and recreational use only. It is NOT a substitute for medical advice, diagnosis, or treatment.

Please consult your child's doctor before beginning if your child has asthma, chronic respiratory conditions, recent surgery, or any diagnosed condition.

Stop immediately if your child experiences pain, dizziness, or shortness of breath.

By using this app you confirm you are a parent or legal guardian and accept responsibility for determining whether this content is appropriate for your child.`;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useProfileStore((s) => s.profile);
  const updateTier = useProfileStore((s) => s.updateTier);
  const { completedSessions, streakDays } = useProgressStore();

  const [showPinGate, setShowPinGate] = useState(false);
  const [pendingTier, setPendingTier] = useState<AgeTier | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  function handleTierPress(tier: AgeTier) {
    if (tier === profile?.tier) return;
    setPendingTier(tier);
    setShowPinGate(true);
  }

  function handlePinSuccess() {
    if (pendingTier) {
      updateTier(pendingTier);
    }
    setShowPinGate(false);
    setPendingTier(null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🧘</Text>
        </View>
        <Text style={styles.name}>Hi, {profile?.preferredCharacterName ?? 'there'}! 👋</Text>
        <Text style={styles.tierLabel}>
          {TIERS.find((t) => t.tier === profile?.tier)?.label ?? 'Explorer'} · Ages{' '}
          {TIERS.find((t) => t.tier === profile?.tier)?.range ?? '7–9'}
        </Text>
      </View>

      {/* Progress */}
      <Text style={styles.sectionLabel}>My Progress</Text>
      <View style={styles.card}>
        <Text style={styles.progressRow}>🔥 {streakDays}-day streak</Text>
        <Text style={styles.progressRow}>✅ {completedSessions.length} sessions complete</Text>
      </View>

      {/* Age tier selector */}
      <Text style={styles.sectionLabel}>Change Age Group</Text>
      <View style={styles.tierRow}>
        {TIERS.map((t) => {
          const isSelected = profile?.tier === t.tier;
          return (
            <TouchableOpacity
              key={t.tier}
              style={[styles.tierBtn, isSelected && { backgroundColor: t.accent, borderColor: t.accent }]}
              onPress={() => handleTierPress(t.tier)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Age group ${t.range}${isSelected ? ', currently selected' : ''}`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.tierBtnText, isSelected && styles.tierBtnTextSelected]}>
                {t.range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Disclaimer */}
      <Text style={styles.sectionLabel}>Safety</Text>
      <TouchableOpacity
        style={styles.disclaimerBtn}
        onPress={() => setShowDisclaimer(true)}
        accessibilityRole="button"
        accessibilityLabel="Review medical disclaimer"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.disclaimerBtnText}>⚠️ Medical Disclaimer</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* PinGate overlay */}
      {showPinGate && (
        <PinGate
          onSuccess={handlePinSuccess}
          onCancel={() => { setShowPinGate(false); setPendingTier(null); }}
        />
      )}

      {/* Disclaimer sheet */}
      <DisclaimerSheet
        visible={showDisclaimer}
        title="Medical Disclaimer"
        body={DISCLAIMER_BODY}
        onConfirm={() => setShowDisclaimer(false)}
        onDismiss={() => setShowDisclaimer(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF2' },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  avatarSection: { alignItems: 'center', paddingTop: 32, paddingBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F9A825', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 48 },
  name: { fontSize: 24, fontWeight: '700', color: '#1C1C2E', marginBottom: 4 },
  tierLabel: { fontSize: 14, color: '#7B7B99' },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#1C1C2E', marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  progressRow: { fontSize: 16, fontWeight: '600', color: '#1C1C2E' },
  tierRow: { flexDirection: 'row', gap: 8 },
  tierBtn: { flex: 1, height: 44, borderRadius: 100, borderWidth: 2, borderColor: '#E0E0E0', backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  tierBtnText: { fontSize: 14, fontWeight: '700', color: '#7B7B99' },
  tierBtnTextSelected: { color: '#FFFFFF' },
  disclaimerBtn: { backgroundColor: '#FFF3CD', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', minHeight: 56 },
  disclaimerBtnText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#FB8C00' },
  chevron: { fontSize: 20, color: '#FB8C00' },
});
