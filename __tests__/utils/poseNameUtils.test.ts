import { poseName } from '../../src/utils/poseNameUtils';
import { Pose } from '../../src/types';

const poseWithAnimal: Pose = {
  id: 'cat-cow',
  englishName: 'Cat-Cow Pose',
  sanskritName: 'Marjaryasana-Bitilasana',
  animalName: 'Cat and Cow',
  howItHelps: 'test',
  ageSuitability: 'both',
  holdTimeBreaths: { min: 5, max: 10 },
  contraindications: [],
  lottieAsset: '',
  thumbnailAsset: '',
};

const poseNoAnimal: Pose = {
  id: 'boat-pose',
  englishName: 'Boat Pose',
  sanskritName: 'Navasana',
  howItHelps: 'test',
  ageSuitability: '7-9',
  holdTimeBreaths: { min: 3, max: 5 },
  contraindications: [],
  lottieAsset: '',
  thumbnailAsset: '',
};

describe('poseName', () => {
  describe('seedling tier', () => {
    it('returns animalName when present', () => {
      expect(poseName(poseWithAnimal, 'seedling')).toBe('Cat and Cow');
    });
    it('falls back to englishName when animalName absent', () => {
      expect(poseName(poseNoAnimal, 'seedling')).toBe('Boat Pose');
    });
  });
  describe('explorer tier', () => {
    it('returns English with Sanskrit in parens', () => {
      expect(poseName(poseWithAnimal, 'explorer')).toBe('Cat-Cow Pose (Marjaryasana-Bitilasana)');
    });
  });
  describe('yogi tier', () => {
    it('returns Sanskrit with English in parens', () => {
      expect(poseName(poseWithAnimal, 'yogi')).toBe('Marjaryasana-Bitilasana (Cat-Cow Pose)');
    });
  });
});
