import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore, TIER_CONFIG } from '../../store/useProfileStore';
import { onboardingDraft } from './onboardingDraft';
import type { AgeTier, AgeProfile } from '../../types';

type Nav = NativeStackNavigationProp<any>;
const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'] as const;

export default function PinSetupScreen() {
  const navigation = useNavigation<Nav>();
  const [digits, setDigits] = useState<string[]>([]);
  const { setProfile, setPin } = useProfileStore();

  function handleKey(key: string) {
    if (key === '') return;
    if (key === '⌫') { setDigits((prev) => prev.slice(0, -1)); return; }
    if (digits.length >= 4) return;
    const next = [...digits, key];
    setDigits(next);
    if (next.length === 4) {
      const pin = next.join('');
      const tier = (onboardingDraft.tier ?? 'explorer') as AgeTier;
      const profile: AgeProfile = {
        tier,
        ...TIER_CONFIG[tier],
        preferredCharacterName: onboardingDraft.childName ?? '',
        yogiColor: onboardingDraft.yogiColor ?? '#F9A825',
        hasAcceptedDisclaimer: true,
        disclaimerAcceptedAt: Date.now(),
        parentPin: pin,
      };
      setProfile(profile);
      setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] }), 250);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF2" />
      <View style={styles.lockIcon} accessibilityLabel="Lock icon" />
      <Text style={styles.heading}>Set a Parent PIN</Text>
      <Text style={styles.subheading}>You'll use this to access parent settings</Text>
      <View style={styles.pinRow} accessibilityLabel={`${digits.length} of 4 digits entered`}>
        {Array.from({ length: 4 }).map((_, i) => {
          const filled = i < digits.length;
          return (
            <View key={i} style={[styles.pinBox, filled && styles.pinBoxFilled]}>
              {filled && <View style={styles.pinDot} />}
            </View>
          );
        })}
      </View>
      <View style={styles.numpad}>
        {KEYS.map((key, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.key, key === '' && styles.keyInvisible]}
            onPress={() => handleKey(key)}
            disabled={key === ''}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={key === '⌫' ? 'Backspace' : key === '' ? '' : `Digit ${key}`}
          >
            <Text style={[styles.keyText, key === '⌫' && styles.backspaceText]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFBF2', alignItems: 'center', paddingTop: 32 },
  lockIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8EAF6', marginBottom: 24 },
  heading: { fontSize: 26, fontWeight: '700', color: '#1C1C2E', marginBottom: 8 },
  subheading: { fontSize: 15, color: '#7B7B99', textAlign: 'center', paddingHorizontal: 40, marginBottom: 40 },
  pinRow: { flexDirection: 'row', gap: 16, marginBottom: 48 },
  pinBox: { width: 56, height: 64, borderRadius: 16, borderWidth: 2, borderColor: '#E8E8EE', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  pinBoxFilled: { borderColor: '#F9A825', backgroundColor: '#FFF8E1' },
  pinDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#F9A825' },
  numpad: { width: 280, flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  key: { width: 80, height: 64, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E8EE', alignItems: 'center', justifyContent: 'center' },
  keyInvisible: { backgroundColor: 'transparent', borderColor: 'transparent' },
  keyText: { fontSize: 22, fontWeight: '700', color: '#1C1C2E' },
  backspaceText: { fontSize: 20, color: '#7B7B99' },
});
