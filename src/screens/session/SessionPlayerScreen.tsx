import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function SessionPlayerScreen() {
  return <View style={styles.c}><Text style={styles.t}>Session Player</Text></View>;
}
const styles = StyleSheet.create({ c: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A2E' }, t: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' } });
