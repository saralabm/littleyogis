import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<any>;
type Route = RouteProp<{ BreathingComplete: { exerciseName: string; roundsCompleted: number } }, 'BreathingComplete'>;

export default function BreathingCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { exerciseName, roundsCompleted } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View testID="breathing-complete-screen" style={styles.container}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.heading}>Amazing Job!</Text>
        <Text style={styles.exerciseName}>{exerciseName}</Text>
        <View style={styles.statsCard}>
          <Text style={styles.statsText}>{roundsCompleted} rounds complete</Text>
          <Text style={styles.statsSubtext}>Your breathing is beautiful.</Text>
        </View>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.libraryBtn}
          onPress={() => navigation.navigate('BreathingLibrary')}
          accessibilityRole="button"
          accessibilityLabel="Try another breathing exercise"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.libraryBtnText}>Try Another</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 16 },
  emoji: { fontSize: 64 },
  heading: { fontSize: 36, fontWeight: '700', color: '#F0F0FF', textAlign: 'center' },
  exerciseName: { fontSize: 22, fontWeight: '700', color: '#80CBC4', textAlign: 'center' },
  statsCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 32, alignItems: 'center', gap: 8 },
  statsText: { fontSize: 18, fontWeight: '700', color: '#FFF176' },
  statsSubtext: { fontSize: 16, color: 'rgba(240,240,255,0.7)' },
  homeBtn: { backgroundColor: '#F9A825', borderRadius: 100, paddingVertical: 16, paddingHorizontal: 40 },
  homeBtnText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
  libraryBtn: { paddingVertical: 12, paddingHorizontal: 32 },
  libraryBtnText: { fontSize: 16, color: 'rgba(240,240,255,0.7)', textDecorationLine: 'underline' },
});
