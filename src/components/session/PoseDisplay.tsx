import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Pose, AgeTier } from '../../types';
import { poseName } from '../../utils/poseNameUtils';
import { PoseAnimation } from './PoseAnimation';

interface PoseDisplayProps {
  pose: Pose;
  tier: AgeTier;
}

export function PoseDisplay({ pose, tier }: PoseDisplayProps) {
  const name = poseName(pose, tier);
  return (
    <View style={styles.container} accessibilityLabel={`${name} pose animation`} accessibilityRole="image">
      <PoseAnimation poseId={pose.id} tier={tier} />
      <Text style={styles.poseName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  poseName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginTop: 12, textAlign: 'center' },
});
