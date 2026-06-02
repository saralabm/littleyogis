import { buildSession } from '../../src/utils/buildSession';
import { Ailment, AgeProfile } from '../../src/types';

const mockAilment: Ailment = {
  id: 'test-ailment',
  category: 'physical',
  displayName: 'Test',
  childFriendlyName: 'Test Yoga',
  emoji: '🧘',
  accentColor: '#66BB6A',
  shortDescription: 'Test.',
  recommendedBreathingIds: [],
  appTip: '',
  poses: [
    {
      id: 'pose-both',
      englishName: 'Both Pose',
      sanskritName: 'Ubhaya',
      howItHelps: 'Good for all.',
      ageSuitability: 'both',
      holdTimeBreaths: { min: 3, max: 8 },
      contraindications: [],
      lottieAsset: '',
      thumbnailAsset: '',
    },
    {
      id: 'pose-7-9',
      englishName: 'Explorer Pose',
      sanskritName: 'Exploriana',
      howItHelps: 'Good for explorers.',
      ageSuitability: '7-9',
      holdTimeBreaths: { min: 3, max: 10 },
      contraindications: [],
      lottieAsset: '',
      thumbnailAsset: '',
    },
    {
      id: 'pose-4-6',
      englishName: 'Seedling Pose',
      sanskritName: 'Seedliana',
      animalName: 'Little Sprout',
      howItHelps: 'Good for seedlings.',
      ageSuitability: '4-6',
      holdTimeBreaths: { min: 2, max: 5 },
      contraindications: [],
      lottieAsset: '',
      thumbnailAsset: '',
    },
  ],
};

const seedlingProfile: AgeProfile = {
  tier: 'seedling',
  ageRange: '4-6',
  vocabularyLevel: 'animal-only',
  maxHoldBreaths: 6,
  hasAcceptedDisclaimer: true,
};

const explorerProfile: AgeProfile = {
  tier: 'explorer',
  ageRange: '7-9',
  vocabularyLevel: 'intro-sanskrit',
  maxHoldBreaths: 8,
  hasAcceptedDisclaimer: true,
};

describe('buildSession — seedling', () => {
  it('includes only both and 4-6 poses', () => {
    const session = buildSession(mockAilment, seedlingProfile);
    const poseSteps = session.steps.filter((s) => s.type === 'pose');
    expect(poseSteps).toHaveLength(2);
    expect(poseSteps.map((s) => s.poseId)).toEqual(['pose-both', 'pose-4-6']);
  });
  it('inserts 1 transition between 2 poses', () => {
    const session = buildSession(mockAilment, seedlingProfile);
    const transitions = session.steps.filter((s) => s.type === 'transition');
    expect(transitions).toHaveLength(1);
  });
  it('does NOT insert transition after last pose', () => {
    const session = buildSession(mockAilment, seedlingProfile);
    expect(session.steps[session.steps.length - 1].type).toBe('pose');
  });
  it('caps pose duration at maxHoldBreaths', () => {
    const session = buildSession(mockAilment, seedlingProfile);
    const bothStep = session.steps.find((s) => s.poseId === 'pose-both');
    // min(8, 6) = 6; 6 * 4s = 24s
    expect(bothStep?.durationSeconds).toBe(24);
  });
  it('computes correct totalDurationSeconds', () => {
    const session = buildSession(mockAilment, seedlingProfile);
    // pose-both: min(8,6)=6 * 4 = 24; transition: 3; pose-4-6: min(5,6)=5 * 4 = 20 → total 47
    expect(session.totalDurationSeconds).toBe(47);
  });
});

describe('buildSession — explorer', () => {
  it('includes only both and 7-9 poses', () => {
    const session = buildSession(mockAilment, explorerProfile);
    const poseSteps = session.steps.filter((s) => s.type === 'pose');
    expect(poseSteps.map((s) => s.poseId)).toEqual(['pose-both', 'pose-7-9']);
  });
  it('caps explorer pose at maxHoldBreaths 8', () => {
    const session = buildSession(mockAilment, explorerProfile);
    const explorerStep = session.steps.find((s) => s.poseId === 'pose-7-9');
    // min(10,8)=8; 8 * 4 = 32
    expect(explorerStep?.durationSeconds).toBe(32);
  });
});

describe('buildSession — metadata', () => {
  it('sets ailmentId correctly', () => {
    expect(buildSession(mockAilment, seedlingProfile).ailmentId).toBe('test-ailment');
  });
  it('sets ageTier correctly', () => {
    expect(buildSession(mockAilment, explorerProfile).ageTier).toBe('explorer');
  });
  it('id contains ailmentId and tier', () => {
    expect(buildSession(mockAilment, seedlingProfile).id).toMatch(/^test-ailment-seedling-\d+$/);
  });
});
