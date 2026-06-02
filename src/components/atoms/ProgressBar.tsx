import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface ProgressBarProps {
  fill: number; // 0–1
  style?: ViewStyle;
  color?: string;
}

export function ProgressBar({ fill, style, color = '#F9A825' }: ProgressBarProps) {
  const animValue = useRef(new Animated.Value(fill)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: fill,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [fill, animValue]);

  const widthPercent = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[styles.track, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 1, now: fill }}
    >
      <Animated.View style={[styles.fill, { width: widthPercent, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.30)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 100 },
});
