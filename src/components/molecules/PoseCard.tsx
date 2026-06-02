import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Pose, AgeTier } from '../../types';

interface PoseCardProps {
  pose: Pose;
  ageTier: AgeTier;
  displayName?: string;
}

export function PoseCard({ pose, ageTier, displayName }: PoseCardProps) {
  const name = displayName ?? pose.englishName;

  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`${name} pose. Hold for ${pose.holdTimeBreaths.min} to ${pose.holdTimeBreaths.max} breaths.`}
    >
      <View style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.holds}>{pose.holdTimeBreaths.min}–{pose.holdTimeBreaths.max} breaths</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: { width: '100%', height: 72, backgroundColor: '#F0F0F8' },
  info: { padding: 8 },
  name: { fontSize: 13, fontWeight: '700', color: '#1C1C2E' },
  holds: { fontSize: 11, color: '#7B7B99', marginTop: 2 },
});
