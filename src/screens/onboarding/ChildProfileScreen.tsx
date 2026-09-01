import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loadDraft, saveDraft } from './onboardingDraft';

type Nav = NativeStackNavigationProp<any>;

const COLORS = [
  { id: 'amber', hex: '#F9A825' }, { id: 'green', hex: '#66BB6A' },
  { id: 'sky', hex: '#42A5F5' }, { id: 'lavender', hex: '#9575CD' }, { id: 'rose', hex: '#EC407A' },
];

export default function ChildProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [childName, setChildName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);

  useEffect(() => {
    loadDraft().then((draft) => {
      if (draft.childName) setChildName(draft.childName);
      if (draft.yogiColor) setSelectedColor(draft.yogiColor);
    }).catch(() => {});
  }, []);

  function handleContinue() {
    saveDraft({ childName: childName.trim(), yogiColor: selectedColor }).catch(() => {});
    navigation.navigate('Disclaimer');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBF2" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.mascot} accessibilityLabel="Yogi mascot" />
          <Text style={styles.heading}>What's your child's name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name..."
            placeholderTextColor="#7B7B99"
            value={childName}
            onChangeText={setChildName}
            maxLength={20}
            returnKeyType="done"
            autoFocus
            autoCorrect={false}
            accessibilityLabel="Child's name"
          />
          <Text style={styles.colorHeading}>Choose Yogi's colour:</Text>
          <View style={styles.colorRow}>
            {COLORS.map((opt) => {
              const isSelected = selectedColor === opt.hex;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.colorTouchTarget}
                  onPress={() => setSelectedColor(opt.hex)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${opt.id} colour`}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={[styles.colorDot, { backgroundColor: opt.hex }, isSelected && styles.colorDotSelected]}>
                    {isSelected && <View style={styles.innerDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.cta, !childName.trim() && styles.ctaDisabled]}
            onPress={handleContinue}
            disabled={!childName.trim()}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text style={styles.ctaText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFBF2' },
  scroll: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 60 },
  mascot: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E8F5E9', alignSelf: 'center', marginBottom: 24 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1C1C2E', marginBottom: 16 },
  input: { height: 56, borderWidth: 2, borderColor: '#E8E8EE', borderRadius: 16, paddingHorizontal: 16, fontSize: 18, color: '#1C1C2E', backgroundColor: '#FFFFFF', marginBottom: 32 },
  colorHeading: { fontSize: 16, fontWeight: '600', color: '#3D3D56', marginBottom: 16 },
  colorRow: { flexDirection: 'row', gap: 16, marginBottom: 40, alignItems: 'center' },
  colorTouchTarget: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  colorDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  colorDotSelected: { transform: [{ scale: 1.2 }] },
  innerDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF' },
  cta: { backgroundColor: '#F9A825', borderRadius: 100, paddingVertical: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
});
