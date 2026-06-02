import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { AgeTier } from '../../types';

interface HoldTimerProps {
  totalSeconds: number;
  secondsRemaining: number;
  breathsTotal: number;
  breathsDone: number;
  tier: AgeTier;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCUMFERENCE = 2 * Math.PI * 120; // r=120

export function HoldTimer({ totalSeconds, secondsRemaining, breathsTotal, breathsDone, tier }: HoldTimerProps) {
  const progress = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0;
  const isWarning = progress <= 0.25;

  if (tier === 'seedling') {
    return (
      <View style={styles.jarContainer}>
        <View style={styles.jarOuter}>
          <View style={[styles.jarFill, { height: `${progress * 100}%` as any, backgroundColor: isWarning ? '#FFF176' : '#80CBC4' }]} />
        </View>
        <Text style={styles.jarCountdown}>{secondsRemaining}s</Text>
        <BreathDots total={breathsTotal} done={breathsDone} />
      </View>
    );
  }

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const strokeColor = isWarning ? '#FFF176' : '#FFFFFF';

  return (
    <View style={styles.ringContainer}>
      <Svg width={280} height={280} viewBox="0 0 280 280">
        {/* Track */}
        <Circle cx={140} cy={140} r={120} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={12} />
        {/* Progress */}
        <Circle
          cx={140} cy={140} r={120} fill="none"
          stroke={strokeColor} strokeWidth={12}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 140 140)"
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={[styles.countdown, { color: strokeColor }]}>{secondsRemaining}</Text>
        <Text style={styles.secLabel}>sec</Text>
      </View>
      <BreathDots total={breathsTotal} done={breathsDone} />
    </View>
  );
}

function BreathDots({ total, done }: { total: number; done: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: Math.max(total, 0) }).map((_, i) => (
        <View key={i} style={[styles.dot, i < done && styles.dotFilled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  jarContainer: { alignItems: 'center', gap: 8 },
  jarOuter: { width: 80, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.20)', overflow: 'hidden', justifyContent: 'flex-end' },
  jarFill: { width: '100%', borderRadius: 60 },
  jarCountdown: { fontSize: 36, fontWeight: '700', color: '#FFFFFF', fontFamily: 'monospace' },
  ringContainer: { alignItems: 'center', gap: 8 },
  ringCenter: { position: 'absolute', top: 0, left: 0, width: 280, height: 280, alignItems: 'center', justifyContent: 'center' },
  countdown: { fontSize: 64, fontWeight: '700', fontFamily: 'monospace' },
  secLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: -8 },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotFilled: { backgroundColor: '#FFF176' },
});
