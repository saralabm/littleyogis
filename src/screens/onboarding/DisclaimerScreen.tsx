import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, NativeSyntheticEvent, NativeScrollEvent, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileStore } from '../../store/useProfileStore';

type Nav = NativeStackNavigationProp<any>;

const DISCLAIMER = `Healing Stars provides general wellness movement and breathing content for educational and recreational use only. It is NOT a substitute for medical advice, diagnosis, or treatment.

Please consult your child's doctor before beginning if your child:
• Has asthma or chronic respiratory conditions
• Has had recent surgery or injury
• Has a diagnosed spinal, joint, or musculoskeletal condition
• Has any condition affected by physical activity

Stop immediately if your child experiences pain, dizziness, or shortness of breath.

By continuing you confirm you are a parent or legal guardian and accept responsibility for determining whether this content is appropriate for your child.`;

export default function DisclaimerScreen() {
  const navigation = useNavigation<Nav>();
  const acceptDisclaimer = useProfileStore((s) => s.acceptDisclaimer);
  // On web, scroll events are unreliable — allow checkbox immediately
  const [scrollEnabled, setScrollEnabled] = useState(Platform.OS === 'web');
  const [checked, setChecked] = useState(false);
  const contentHeightRef = useRef(0);
  const layoutHeightRef = useRef(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (scrollEnabled) return;
    const offsetY = e.nativeEvent.contentOffset.y;
    const scrollable = contentHeightRef.current - layoutHeightRef.current;
    if (scrollable <= 0 || offsetY / scrollable >= 0.8) setScrollEnabled(true);
  }

  function handleAgree() {
    acceptDisclaimer();
    navigation.navigate('PinSetup');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF2" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚠️  Important Information</Text>
        <Text style={styles.headerSub}>Please read carefully before continuing</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(_, h) => {
          contentHeightRef.current = h;
          if (h <= layoutHeightRef.current) setScrollEnabled(true);
        }}
        onLayout={(e) => {
          layoutHeightRef.current = e.nativeEvent.layout.height;
          if (contentHeightRef.current > 0 && contentHeightRef.current <= e.nativeEvent.layout.height) setScrollEnabled(true);
        }}
        accessibilityLabel="Disclaimer text, scroll to read"
      >
        <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
      <View style={styles.checkRow}>
        <TouchableOpacity
          style={[styles.checkbox, !scrollEnabled && styles.checkboxLocked]}
          onPress={() => scrollEnabled && setChecked((c) => !c)}
          disabled={!scrollEnabled}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled: !scrollEnabled }}
          accessibilityLabel="I have read and understand this information"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {checked && <Text style={styles.tick}>✓</Text>}
        </TouchableOpacity>
        <Text style={[styles.checkLabel, !scrollEnabled && { color: '#7B7B99' }]}>
          I have read and understand this information
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cta, !checked && styles.ctaDisabled]}
          onPress={handleAgree}
          disabled={!checked}
          accessibilityRole="button"
          accessibilityLabel="I Agree — Let's Get Started"
          accessibilityState={{ disabled: !checked }}
        >
          <Text style={styles.ctaText}>I Agree — Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFBF2' },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1C1C2E' },
  headerSub: { fontSize: 14, color: '#7B7B99', marginTop: 4 },
  scroll: { flex: 1, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8E8EE' },
  scrollContent: { padding: 20 },
  disclaimerText: { fontSize: 15, lineHeight: 24, color: '#3D3D56' },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  checkbox: { width: 44, height: 44, borderRadius: 8, borderWidth: 2, borderColor: '#F9A825', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  checkboxLocked: { borderColor: '#C8C8D0', opacity: 0.5 },
  tick: { fontSize: 16, color: '#F9A825', fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1C1C2E' },
  footer: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 4 },
  cta: { backgroundColor: '#66BB6A', borderRadius: 100, paddingVertical: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
});
