import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useProfileStore } from '../../store/useProfileStore';

interface PinGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'] as const;
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 30000;

export function PinGate({ onSuccess, onCancel }: PinGateProps) {
  const profile = useProfileStore((s) => s.profile);
  const [digits, setDigits] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockCountdown, setLockCountdown] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function handleKey(key: string) {
    if (isLocked || key === '') return;
    if (key === '⌫') { setDigits((d) => d.slice(0, -1)); return; }
    if (digits.length >= 4) return;
    const next = [...digits, key];
    setDigits(next);
    if (next.length === 4) {
      const entered = next.join('');
      if (entered === profile?.parentPin) {
        onSuccess();
        setDigits([]);
        setWrongAttempts(0);
      } else {
        const nextAttempts = wrongAttempts + 1;
        setWrongAttempts(nextAttempts);
        setDigits([]);
        shake();
        if (nextAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS;
          setLockedUntil(until);
          setLockCountdown(30);
          const interval = setInterval(() => {
            setLockCountdown((c) => {
              if (c <= 1) { clearInterval(interval); setLockedUntil(null); setWrongAttempts(0); return 0; }
              return c - 1;
            });
          }, 1000);
        }
      }
    }
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel">
        <Text style={styles.cancelText}>✕ Cancel</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Parent Access</Text>
      {isLocked ? (
        <Text style={styles.lockMsg}>Too many attempts. Try again in {lockCountdown}s</Text>
      ) : (
        <>
          <Animated.View style={[styles.pinRow, { transform: [{ translateX: shakeAnim }] }]}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={[styles.pinBox, i < digits.length && styles.pinBoxFilled]}>
                {i < digits.length && <View style={styles.pinDot} />}
              </View>
            ))}
          </Animated.View>
          {wrongAttempts > 0 && <Text style={styles.errorText}>Incorrect PIN</Text>}
        </>
      )}
      <View style={[styles.numpad, isLocked && styles.numpadLocked]}>
        {KEYS.map((key, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.key, key === '' && styles.keyInvisible]}
            onPress={() => handleKey(key)}
            disabled={key === '' || isLocked}
            accessibilityRole="button"
            accessibilityLabel={key === '⌫' ? 'Delete last digit' : key === '' ? '' : `digit ${key}`}
          >
            <Text style={[styles.keyText, key === '⌫' && styles.backspaceText]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1A1A2E', zIndex: 9999, alignItems: 'center', paddingTop: 60 },
  cancelBtn: { position: 'absolute', top: 20, left: 20, padding: 10, minWidth: 44, minHeight: 44 },
  cancelText: { color: '#F0F0FF', fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#F0F0FF', marginBottom: 40 },
  pinRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  pinBox: { width: 56, height: 64, borderRadius: 16, borderWidth: 2, borderColor: '#E8E8EE', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pinBoxFilled: { borderColor: '#F9A825' },
  pinDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#F9A825' },
  errorText: { color: '#EF5350', fontSize: 14, marginBottom: 16 },
  lockMsg: { color: '#EF5350', fontSize: 16, textAlign: 'center', paddingHorizontal: 40 },
  numpad: { width: 280, flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 24 },
  numpadLocked: { opacity: 0.3 },
  key: { width: 80, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  keyInvisible: { backgroundColor: 'transparent', borderColor: 'transparent' },
  keyText: { fontSize: 22, fontWeight: '700', color: '#F0F0FF' },
  backspaceText: { color: '#7B7B99' },
});
