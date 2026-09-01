import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { breathingExercises } from '../../data/index';
import { BreathingCard } from '../../components/molecules/BreathingCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Nav = NativeStackNavigationProp<any>;
type FilterKey = 'calm' | 'energy' | 'sleep' | 'focus';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'calm', label: '🌿 Calm' },
  { key: 'energy', label: '⚡ Energy' },
  { key: 'sleep', label: '😴 Sleep' },
  { key: 'focus', label: '🎯 Focus' },
];

export default function BreathingLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  const filtered = useMemo(() => {
    if (!activeFilter) return breathingExercises;
    return breathingExercises.filter((ex) =>
      ex.whatItHelps.some((tag) => tag.toLowerCase().includes(activeFilter))
    );
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Breathing Library</Text>
        <Text style={styles.subtitle}>9 exercises for calm & focus</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, activeFilter === f.key && styles.chipActive]}
            onPress={() => setActiveFilter(activeFilter === f.key ? null : f.key)}
            accessibilityRole="button"
            accessibilityLabel={`Filter: ${f.label}${activeFilter === f.key ? ', active' : ''}`}
            accessibilityState={{ selected: activeFilter === f.key }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={[styles.chipText, activeFilter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <BreathingCard
            exercise={item}
            onPress={() => navigation.navigate('BreathingPlayer', { exerciseId: item.id })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  header: { paddingHorizontal: spacing.screenPaddingH, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text.primary },
  subtitle: { fontSize: 16, color: colors.text.muted, marginTop: 4 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.screenPaddingH, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: spacing.buttonRadius, backgroundColor: 'rgba(28,28,46,0.08)' },
  chipActive: { backgroundColor: colors.text.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text.primary },
  chipTextActive: { color: colors.bg.primary },
  grid: { paddingHorizontal: spacing.screenPaddingH, paddingBottom: 32, gap: 10 },
  row: { gap: 10 },
});
