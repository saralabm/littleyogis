import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function HomeScreen() {
  return <View style={styles.c}><Text style={styles.t}>Home</Text></View>;
}
const styles = StyleSheet.create({ c: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFBF2' }, t: { fontSize: 24, fontWeight: '700', color: '#1C1C2E' } });
