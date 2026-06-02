import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<any>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF2" />
      <View style={styles.illustration} accessibilityLabel="Parent and child doing yoga illustration" />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Welcome to LittleYogi!</Text>
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
  illustration: { width: '100%', height: 240, backgroundColor: '#E8F5E9' },
  textBlock: { paddingHorizontal: 20, paddingTop: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#1C1C2E', textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#3D3D56', textAlign: 'center', marginTop: 8 },
  banner: { marginHorizontal: 20, marginTop: 24, backgroundColor: '#FFF8E1', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#F9A825' },
  bannerText: { fontSize: 16, fontWeight: '600', color: '#3D3D56' },
  footer: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  cta: { backgroundColor: '#F9A825', borderRadius: 100, paddingVertical: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
});
