import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Pose } from '../../types';

interface ContraindicationAlertProps {
  pose: Pose;
  visible: boolean;
  onDismiss: () => void;
}

export function ContraindicationAlert({ pose, visible, onDismiss }: ContraindicationAlertProps) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && pose.contraindications.length > 0) {
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      timerRef.current = setTimeout(onDismiss, 4000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(translateY, { toValue: -120, duration: 300, useNativeDriver: true }).start();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, translateY, onDismiss]);

  if (!visible || pose.contraindications.length === 0) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <TouchableOpacity style={styles.inner} onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss safety note">
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.text}>{pose.contraindications.join(' · ')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: '#FFF9C4' },
  inner: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  icon: { fontSize: 16 },
  text: { flex: 1, fontSize: 14, color: '#1C1C2E', fontWeight: '600' },
});
