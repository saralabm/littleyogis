import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import type { Ailment } from '../../types';

interface AilmentCardProps {
  ailment: Ailment;
  onPress: () => void;
}

export function AilmentCard({ ailment, onPress }: AilmentCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 56) / 2;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, backgroundColor: ailment.accentColor }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${ailment.childFriendlyName}, ${ailment.category} category`}
    >
      <Text style={styles.emoji}>{ailment.emoji}</Text>
      <Text style={styles.name} numberOfLines={2}>{ailment.childFriendlyName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: { position: 'absolute', top: 12, right: 12, fontSize: 36 },
  name: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', lineHeight: 20 },
});
