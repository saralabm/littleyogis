import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { AgeTier, AgeProfile } from '../types';

export const TIER_CONFIG: Record<
  AgeTier,
  Pick<AgeProfile, 'ageRange' | 'vocabularyLevel' | 'maxHoldBreaths'>
> = {
  seedling: { ageRange: '4-6', vocabularyLevel: 'animal-only', maxHoldBreaths: 6 },
  explorer: { ageRange: '7-9', vocabularyLevel: 'intro-sanskrit', maxHoldBreaths: 8 },
  yogi:     { ageRange: '10-12', vocabularyLevel: 'full-sanskrit', maxHoldBreaths: 10 },
};

const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

interface ProfileState {
  profile: AgeProfile | null;
  setProfile: (profile: AgeProfile) => void;
  updateTier: (tier: AgeTier) => void;
  updateName: (name: string) => void;
  acceptDisclaimer: () => void;
  setPin: (pin: string) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,

      setProfile: (profile) => set({ profile }),

      updateTier: (tier) => {
        const existing = get().profile;
        if (!existing) return;
        set({ profile: { ...existing, tier, ...TIER_CONFIG[tier] } });
      },

      updateName: (name) => {
        const existing = get().profile;
        if (!existing) return;
        set({ profile: { ...existing, preferredCharacterName: name } });
      },

      acceptDisclaimer: () => {
        const existing = get().profile;
        if (!existing) return;
        set({
          profile: {
            ...existing,
            hasAcceptedDisclaimer: true,
            disclaimerAcceptedAt: Date.now(),
          },
        });
      },

      setPin: (pin) => {
        const existing = get().profile;
        if (!existing) return;
        set({ profile: { ...existing, parentPin: pin } });
      },

      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'healingstars-profile',
      storage: createJSONStorage(() => secureStoreAdapter),
    },
  ),
);
