import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface BreathCounterProps {
  current: number; // how many rounds completed
  total: number;   // total rounds
}

function AnimatedDot({ filled, justFilled }: { filled: boolean; justFilled: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (justFilled) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.4, duration: 100, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [justFilled, scale]);

  return (
    <Animated.View
      testID="breath-dot"
      style={[
        styles.dot,
        filled ? styles.dotFilled : styles.dotEmpty,
        { transform: [{ scale }] },
      ]}
    />
  );
}

export function BreathCounter({ current, total }: BreathCounterProps) {
  const prevRef = useRef(current);
  useEffect(() => { prevRef.current = current; });

  return (
    <View style={styles.row} accessibilityLabel={`Round ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <AnimatedDot key={i} filled={i < current} justFilled={i === current - 1 && current !== prevRef.current} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotFilled: { backgroundColor: '#FFF176' },
  dotEmpty: { backgroundColor: 'rgba(255,255,255,0.35)' },
});
