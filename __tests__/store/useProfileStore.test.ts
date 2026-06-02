import { useProfileStore } from '../../src/store/useProfileStore';
import type { AgeProfile } from '../../src/types';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const mockProfile: AgeProfile = {
  tier: 'explorer',
  ageRange: '7-9',
  vocabularyLevel: 'intro-sanskrit',
  maxHoldBreaths: 8,
  preferredCharacterName: 'Maya',
  yogiColor: '#42A5F5',
  hasAcceptedDisclaimer: false,
};

beforeEach(() => {
  useProfileStore.setState({ profile: null });
});

describe('useProfileStore', () => {
  it('starts with null profile', () => {
    expect(useProfileStore.getState().profile).toBeNull();
  });

  it('setProfile stores the profile', () => {
    useProfileStore.getState().setProfile(mockProfile);
    expect(useProfileStore.getState().profile).toEqual(mockProfile);
  });

  it('updateTier changes tier and derived fields', () => {
    useProfileStore.getState().setProfile(mockProfile);
    useProfileStore.getState().updateTier('yogi');
    const p = useProfileStore.getState().profile;
    expect(p?.tier).toBe('yogi');
    expect(p?.ageRange).toBe('10-12');
    expect(p?.vocabularyLevel).toBe('full-sanskrit');
    expect(p?.maxHoldBreaths).toBe(10);
  });

  it('updateTier is a no-op when profile is null', () => {
    useProfileStore.getState().updateTier('yogi');
    expect(useProfileStore.getState().profile).toBeNull();
  });

  it('acceptDisclaimer sets hasAcceptedDisclaimer and timestamp', () => {
    useProfileStore.getState().setProfile(mockProfile);
    const before = Date.now();
    useProfileStore.getState().acceptDisclaimer();
    const p = useProfileStore.getState().profile;
    expect(p?.hasAcceptedDisclaimer).toBe(true);
    expect(p?.disclaimerAcceptedAt).toBeGreaterThanOrEqual(before);
  });

  it('setPin stores pin on profile', () => {
    useProfileStore.getState().setProfile(mockProfile);
    useProfileStore.getState().setPin('4321');
    expect(useProfileStore.getState().profile?.parentPin).toBe('4321');
  });

  it('resetProfile returns to null', () => {
    useProfileStore.getState().setProfile(mockProfile);
    useProfileStore.getState().resetProfile();
    expect(useProfileStore.getState().profile).toBeNull();
  });
});
