import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Pose, AgeTier } from '../../types';

interface PoseInstructionsProps {
  pose: Pose;
  tier: AgeTier;
}

function truncateWords(text: string, max: number): string {
  const words = text.split(' ');
  if (words.length <= max) return text;
  return words.slice(0, max).join(' ') + '…';
}

export function PoseInstructions({ pose, tier }: PoseInstructionsProps) {
  const [expanded, setExpanded] = useState(false);

  const fontSize = tier === 'seedling' ? 22 : tier === 'explorer' ? 18 : 16;

  if (tier === 'seedling') {
    return (
      <Text style={[styles.text, { fontSize }]} accessibilityLiveRegion="polite">
        {truncateWords(pose.howItHelps, 5)}
      </Text>
    );
  }

  const maxWords = tier === 'explorer' ? 12 : 50;
  const shouldTruncate = pose.howItHelps.split(' ').length > maxWords;
  const displayText = expanded ? pose.howItHelps : truncateWords(pose.howItHelps, maxWords);

  return (
    <View>
      <Text style={[styles.text, { fontSize }]} accessibilityLiveRegion="polite">{displayText}</Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel={expanded ? 'Show less' : 'Show more'}>
          <Text style={styles.toggle}>{expanded ? 'Show less' : 'Show more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { color: 'rgba(240,240,255,0.85)', lineHeight: 24, textAlign: 'center', paddingHorizontal: 20 },
  toggle: { color: '#80CBC4', fontSize: 14, textAlign: 'center', marginTop: 4 },
});
