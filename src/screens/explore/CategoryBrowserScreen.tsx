import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ailments } from '../../data/index';
import { AilmentCard } from '../../components/molecules/AilmentCard';
import { useProfileStore } from '../../store/useProfileStore';
import { useAgeTheme } from '../../features/age-adaptive/useAgeTheme';

type Nav = NativeStackNavigationProp<any>;

export default function CategoryBrowserScreen() {
  const navigation = useNavigation<Nav>();
  const tier = useProfileStore((s) => s.profile?.tier ?? 'explorer');
  const { accentColor } = useAgeTheme();
  const [category, setCategory] = useState<'physical' | 'emotional'>('physical');

  const filtered = useMemo(
    () => ailments.filter((a) => a.category === category),
    [category]
  );

  return (
    <View style={styles.container}>
      {/* Tab toggle */}
      <View style={styles.tabs}>
        {(['physical', 'emotional'] as const).map((cat) => {
          const isSelected = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, isSelected && { backgroundColor: accentColor, borderColor: accentColor }]}
              onPress={() => setCategory(cat)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${cat === 'physical' ? 'Physical Body' : 'Feelings & Mind'} tab${isSelected ? ', selected' : ''}`}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {cat === 'physical' ? '🌟 Physical Body' : '💜 Feelings & Mind'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <AilmentCard
            ailment={item}
            onPress={() => navigation.navigate('AilmentDetail', { ailmentId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF2' },
  tabs: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 12 },
  tab: { flex: 1, height: 56, borderRadius: 12, borderWidth: 2, borderColor: '#F9A825', alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 15, fontWeight: '700', color: '#F9A825' },
  tabTextSelected: { color: '#FFFFFF' },
  grid: { paddingHorizontal: 20, paddingBottom: 32 },
  row: { gap: 16, marginBottom: 16 },
});
