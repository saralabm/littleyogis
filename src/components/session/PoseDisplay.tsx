import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Pose, AgeTier } from '../../types';
import { poseName } from '../../utils/poseNameUtils';

interface PoseDisplayProps {
  pose: Pose;
  tier: AgeTier;
}

export function PoseDisplay({ pose, tier }: PoseDisplayProps) {
  const name = poseName(pose, tier);
  // Lottie placeholder — actual animations added in Phase 6+
  return (
    <View style={styles.container} accessibilityLabel={`${name} pose animation`} accessibilityRole="image">
      <View style={styles.animationPlaceholder}>
        <Text style={styles.emojiPlaceholder}>🧘</Text>
      </View>
      <Text style={styles.poseName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  animationPlaceholder: { width: '100%', height: 280, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  emojiPlaceholder: { fontSize: 80 },
  poseName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginTop: 12, textAlign: 'center' },
});
