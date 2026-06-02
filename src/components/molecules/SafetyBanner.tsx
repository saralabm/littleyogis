import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';

interface SafetyBannerProps {
  message: string;
  collapsible?: boolean;
}

export function SafetyBanner({ message, collapsible = false }: SafetyBannerProps) {
  const [expanded, setExpanded] = useState(!collapsible);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }

  if (!collapsible) {
    return (
      <View style={styles.banner} accessibilityLiveRegion="polite">
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.banner}>
      <TouchableOpacity
        onPress={toggle}
        style={styles.collapseRow}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Collapse safety note' : 'Expand safety note'}
        accessibilityState={{ expanded }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.collapseLabel}>
          {expanded ? 'Safety note — tap to hide' : 'Safety note — tap to read'}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <Text
          style={[styles.message, { marginTop: 8 }]}
          accessibilityLiveRegion="polite"
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FB8C00',
    borderRadius: 4,
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  collapseRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  icon: { fontSize: 16, marginRight: 8 },
  collapseLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#FB8C00' },
  chevron: { fontSize: 12, color: '#FB8C00' },
  message: { fontSize: 14, color: '#1C1C2E', fontWeight: '600', flex: 1 },
});
