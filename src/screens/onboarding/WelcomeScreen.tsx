import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<any>;

function HeroIllustration() {
  return (
    <Svg width="100%" height="240" viewBox="0 0 375 240">
      {/* Sky background */}
      <Rect x="0" y="0" width="375" height="240" fill="#E8F5E9" />
      {/* Soft ground */}
      <Ellipse cx="187" cy="230" rx="200" ry="40" fill="#C8E6C9" />

      {/* Stars */}
      <Circle cx="40" cy="30" r="4" fill="#F9A825" opacity="0.8" />
      <Circle cx="60" cy="18" r="2.5" fill="#F9A825" opacity="0.6" />
      <Circle cx="310" cy="25" r="3.5" fill="#F9A825" opacity="0.8" />
      <Circle cx="335" cy="40" r="2" fill="#F9A825" opacity="0.5" />
      <Circle cx="290" cy="15" r="2" fill="#FFF176" opacity="0.7" />

      {/* Sun */}
      <Circle cx="320" cy="55" r="22" fill="#F9A825" opacity="0.25" />
      <Circle cx="320" cy="55" r="14" fill="#F9A825" opacity="0.6" />

      {/* Child silhouette in lotus pose */}
      <G transform="translate(187, 115)">
        {/* Crossed legs (lotus) */}
        <Ellipse cx="-28" cy="55" rx="32" ry="12" fill="#66BB6A" />
        <Ellipse cx="28" cy="55" rx="32" ry="12" fill="#66BB6A" />
        {/* Body */}
        <Rect x="-14" y="10" width="28" height="42" rx="14" fill="#42A5F5" />
        {/* Head */}
        <Circle cx="0" cy="0" r="20" fill="#F9A825" />
        {/* Arms raised (peaceful V) */}
        <Path d="M -14 25 Q -40 -5 -30 -20" stroke="#42A5F5" strokeWidth="8" strokeLinecap="round" fill="none" />
        <Path d="M 14 25 Q 40 -5 30 -20" stroke="#42A5F5" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* Hands */}
        <Circle cx="-30" cy="-20" r="6" fill="#F9A825" />
        <Circle cx="30" cy="-20" r="6" fill="#F9A825" />
      </G>

      {/* Leaves / nature accents */}
      <Ellipse cx="80" cy="185" rx="18" ry="10" fill="#A5D6A7" transform="rotate(-30 80 185)" />
      <Ellipse cx="295" cy="190" rx="16" ry="9" fill="#A5D6A7" transform="rotate(25 295 190)" />
    </Svg>
  );
}

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF2" />
      <View accessibilityLabel="Child in yoga pose with stars and sun illustration" accessibilityRole="image">
        <HeroIllustration />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Welcome to Healing Stars!</Text>
        <Text style={styles.subtitle}>Yoga & wellness for children ages 4–12</Text>
      </View>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>👋 This section is for parents & guardians.</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('AgeTier')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Let's Get Started"
        >
          <Text style={styles.ctaText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFBF2' },
  illustration: { width: '100%', height: 240 },
  textBlock: { paddingHorizontal: 20, paddingTop: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#1C1C2E', textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#3D3D56', textAlign: 'center', marginTop: 8 },
  banner: { marginHorizontal: 20, marginTop: 24, backgroundColor: '#FFF8E1', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#F9A825' },
  bannerText: { fontSize: 16, fontWeight: '600', color: '#3D3D56' },
  footer: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  cta: { backgroundColor: '#F9A825', borderRadius: 100, paddingVertical: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
});
