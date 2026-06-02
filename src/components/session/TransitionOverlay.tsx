import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';

interface TransitionOverlayProps {
  nextPoseName: string;
  visible: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function TransitionOverlay({ nextPoseName, visible }: TransitionOverlayProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      setCountdown(3);
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      timerRef.current = setInterval(() => {
        setCountdown((c) => { if (c <= 1) { clearInterval(timerRef.current!); return 0; } return c - 1; });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }).start();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [visible, translateY]);

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
      <Text style={styles.label}>Coming up</Text>
      <Text style={styles.poseName}>{nextPoseName}</Text>
      <Text style={styles.countdown}>{countdown}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, backgroundColor: 'rgba(26,26,46,0.95)', borderTopLeftRadius: 24, borderTopRightRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontSize: 14, color: 'rgba(240,240,255,0.7)' },
  poseName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  countdown: { fontSize: 36, fontWeight: '700', color: '#FFF176', fontFamily: 'monospace' },
});
