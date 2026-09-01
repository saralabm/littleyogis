import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'onboarding_draft';

export interface OnboardingDraft {
  tier?: string;
  childName?: string;
  yogiColor?: string;
}

export async function saveDraft(patch: Partial<OnboardingDraft>): Promise<void> {
  const existing = await loadDraft();
  const merged: OnboardingDraft = { ...existing, ...patch };
  await AsyncStorage.setItem(KEY, JSON.stringify(merged));
}

export async function loadDraft(): Promise<OnboardingDraft> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OnboardingDraft;
  } catch {
    return {};
  }
}

export async function clearDraft(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
