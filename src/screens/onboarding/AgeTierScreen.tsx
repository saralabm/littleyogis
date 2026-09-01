import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { saveDraft } from './onboardingDraft';
import type { AgeTier } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Nav = NativeStackNavigationProp<any>;

const TIERS = [
  { tier: 'seedling' as AgeTier, emoji: '🌱', label: 'Little Yogi', ageRange: '4 – 6', accentColor: '#FFB300', bgColor: '#FFF8E1' },
  { tier: 'explorer' as AgeTier, emoji: '🌳', label: 'Explorer Yogi', ageRange: '7 – 9', accentColor: '#558B2F', bgColor: '#F1F8E9' },
  { tier: 'yogi' as AgeTier, emoji: '⛰️', label: 'Warrior Yogi', ageRange: '10 – 12', accentColor: '#3949AB', bgColor: '#E8EAF6' },
];

export default function AgeTierScreen() {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<AgeTier | null>(null);

  function handleContinue() {
    if (!selected) return;
    saveDraft({ tier: selected }).catch(() => {});
    navigation.navigate('ChildProfile');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg.primary} />
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <Text style={styles.heading}>How old is your child?</Text>
        <Text style={styles.subheading}>Choose the right level for them</Text>
        <View style={styles.cards}>
          {TIERS.map((card) => {
            const isSelected = selected === card.tier;
            return (
              <TouchableOpacity
                key={card.tier}
                style={[styles.card, isSelected && { backgroundColor: card.bgColor, borderColor: card.accentColor, borderWidth: 2 }]}
                onPress={() => setSelected(card.tier)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${card.label}, ages ${card.ageRange}`}
              >
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardAge, isSelected && { color: card.accentColor }]}>Ages {card.ageRange}</Text>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                </View>
                {isSelected && <View style={[styles.check, { backgroundColor: card.accentColor }]}><Text style={styles.checkMark}>✓</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !selected }}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.screenPaddingH, paddingTop: 40, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  subheading: { fontSize: 16, color: colors.text.muted, marginBottom: 32 },
  cards: { gap: 12 },
  card: { height: 80, backgroundColor: colors.bg.card, borderRadius: spacing.buttonRadius, borderWidth: 1.5, borderColor: '#E8E8EE', flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.screenPaddingH, gap: 14 },
  cardEmoji: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardAge: { fontSize: 12, fontWeight: '600', color: colors.text.muted, textTransform: 'uppercase' },
  cardLabel: { fontSize: 17, fontWeight: '700', color: colors.text.primary },
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: colors.bg.card, fontSize: 14, fontWeight: '700' },
  cta: { backgroundColor: colors.primary.sunshine, borderRadius: spacing.buttonRadius, paddingVertical: 18, alignItems: 'center', marginTop: 32, minHeight: spacing.minTouchTarget, justifyContent: 'center' },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
});
