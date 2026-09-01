import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'healingstars:seen_disclaimers';
export const ALWAYS_SHOW_DISCLAIMER_AILMENTS = ['asthma', 'weight-support'];

async function getSeenSet(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch { return new Set(); }
}

async function saveSeenSet(seen: Set<string>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

interface DisclaimerStateHook {
  shouldShowCategoryDisclaimer: (ailmentId: string) => Promise<boolean>;
  markCategoryDisclaimer: (ailmentId: string) => Promise<void>;
}

export function useDisclaimerState(): DisclaimerStateHook {
  async function shouldShowCategoryDisclaimer(ailmentId: string): Promise<boolean> {
    if (ALWAYS_SHOW_DISCLAIMER_AILMENTS.includes(ailmentId)) return true;
    const seen = await getSeenSet();
    return !seen.has(ailmentId);
  }

  async function markCategoryDisclaimer(ailmentId: string): Promise<void> {
    const seen = await getSeenSet();
    seen.add(ailmentId);
    await saveSeenSet(seen);
  }

  return { shouldShowCategoryDisclaimer, markCategoryDisclaimer };
}
