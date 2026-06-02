import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface DisclaimerSheetProps {
  visible: boolean;
  title: string;
  body: string;
  onConfirm: () => void;
  onDismiss?: () => void;
  confirmLabel?: string;
}

export function DisclaimerSheet({ visible, title, body, onConfirm, onDismiss, confirmLabel = 'I Understand' }: DisclaimerSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss} accessibilityLabel="Dismiss" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 16 }}>
          <Text style={styles.bodyText}>{body}</Text>
        </ScrollView>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel={confirmLabel}
        >
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 380,
    padding: 20,
    paddingBottom: 32,
  },
  handle: { width: 32, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C2E', marginBottom: 12 },
  body: { flex: 1 },
  bodyText: { fontSize: 16, lineHeight: 24, color: '#3D3D56' },
  confirmBtn: { backgroundColor: '#F9A825', borderRadius: 100, paddingVertical: 16, alignItems: 'center', minHeight: 56, justifyContent: 'center', marginTop: 8 },
  confirmText: { fontSize: 18, fontWeight: '700', color: '#1C1C2E' },
});
