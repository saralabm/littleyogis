import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, AccessibilityInfo } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { BreathCycle } from '../../types';

interface BreathingCircleProps {
  phase: BreathCycle;
  progress: number; // 0–1
  size?: number;
}

const DEFAULT_SIZE = 320;
const RESTING_FRACTION = 0.375;  // 120/320
const EXPANDED_FRACTION = 0.75;  // 240/320

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lerpColor(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`;
}

const AnimatedCircleSvg = Animated.createAnimatedComponent(Circle);

export function BreathingCircle({ phase, progress, size = DEFAULT_SIZE }: BreathingCircleProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const animDiameter = useRef(new Animated.Value(size * RESTING_FRACTION)).current;
  const shimmerOpacity = useRef(new Animated.Value(0.7)).current;
  const shimmerAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  const resting = size * RESTING_FRACTION;
  const expanded = size * EXPANDED_FRACTION;

  let targetDiam = resting;
  let circleColor = '#80CBC4';

  switch (phase.phase) {
    case 'inhale':
      targetDiam = lerp(resting, expanded, Math.sqrt(Math.max(0, Math.min(1, progress))));
      circleColor = lerpColor('#80CBC4', '#42A5F5', progress);
      break;
    case 'hold':
    case 'holdAfterExhale':
      targetDiam = expanded;
      circleColor = '#42A5F5';
      break;
    case 'exhale': {
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
      targetDiam = lerp(expanded, resting, eased);
      circleColor = lerpColor('#42A5F5', '#FFAB76', progress);
      break;
    }
  }

  useEffect(() => {
    if (!reduceMotion) {
      Animated.timing(animDiameter, { toValue: targetDiam, duration: 50, useNativeDriver: false }).start();
    }
  }, [targetDiam, reduceMotion, animDiameter]);

  // Shimmer for hold phase
  useEffect(() => {
    if ((phase.phase === 'hold' || phase.phase === 'holdAfterExhale') && !reduceMotion) {
      shimmerAnim.current = Animated.loop(Animated.sequence([
        Animated.timing(shimmerOpacity, { toValue: 1.0, duration: 700, useNativeDriver: true }),
        Animated.timing(shimmerOpacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ]));
      shimmerAnim.current.start();
    } else {
      shimmerAnim.current?.stop();
      shimmerOpacity.setValue(0.85);
    }
  }, [phase.phase, reduceMotion, shimmerOpacity]);

  const center = size / 2;

  if (reduceMotion) {
    return (
      <View
        testID="breathing-circle-container"
        style={[styles.container, { width: size, height: size }]}
        accessible
        accessibilityRole="text"
        accessibilityLiveRegion="polite"
        accessibilityLabel={`${phase.label} phase, ${phase.durationSeconds} seconds`}
      >
        <View style={[styles.staticCircle, { width: resting, height: resting, borderRadius: resting / 2, backgroundColor: circleColor }]}>
          <Text style={styles.label}>{phase.label}</Text>
        </View>
      </View>
    );
  }

  const animRadius = animDiameter.interpolate({ inputRange: [resting, expanded], outputRange: [resting / 2, expanded / 2], extrapolate: 'clamp' });

  return (
    <View testID="breathing-circle-container" style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <AnimatedCircleSvg cx={center} cy={center} r={animRadius as unknown as number} fill={circleColor} />
      </Svg>
      <Animated.View style={[styles.labelContainer, { opacity: shimmerOpacity }]} accessibilityLiveRegion="polite" accessibilityLabel={`${phase.label} phase`}>
        <Text style={styles.label}>{phase.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  staticCircle: { alignItems: 'center', justifyContent: 'center' },
  labelContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
});
