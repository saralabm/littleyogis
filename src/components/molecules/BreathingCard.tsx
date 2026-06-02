import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import type { BreathingExercise } from '../../types';

interface BreathingCardProps {
  exercise: BreathingExercise;
  onPress: () => void;
}

export function BreathingCard({ exercise, onPress }: BreathingCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 48) / 3;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, backgroundColor: exercise.gradientColors[0] }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.kidFriendlyName} breathing exercise`}
    >
      <Text style={styles.emoji}>{exercise.emoji}</Text>
      <Text style={styles.name} numberOfLines={2}>{exercise.kidFriendlyName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: { fontSize: 28 },
  name: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
});
