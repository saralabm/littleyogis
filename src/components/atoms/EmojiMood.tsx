import React, { useRef } from 'react';
import { Pressable, Animated, Text, StyleSheet, View } from 'react-native';

interface EmojiMoodProps {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function EmojiMood({ emoji, label, selected, onPress, accessibilityLabel }: EmojiMoodProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePress() {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 40 }),
      Animated.spring(scale, { toValue: 1.1, useNativeDriver: true, speed: 40 }),
    ]).start();
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `${label} mood`}
      accessibilityState={{ selected }}
      style={styles.touchArea}
    >
      <Animated.View
        style={[
          styles.bubble,
          selected && styles.selected,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchArea: { alignItems: 'center', minWidth: 44 },
  bubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#F9A825',
    shadowColor: '#F9A825',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  emoji: { fontSize: 28 },
  label: { fontSize: 11, color: '#7B7B99', marginTop: 4, textAlign: 'center' },
});
