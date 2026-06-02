import { tierFromAge, vocabLevel, maxBreaths } from '../../src/utils/ageUtils';

describe('tierFromAge', () => {
  it('returns seedling for ages 1–6', () => {
    expect(tierFromAge(4)).toBe('seedling');
    expect(tierFromAge(6)).toBe('seedling');
    expect(tierFromAge(1)).toBe('seedling');
  });
  it('returns explorer for ages 7–9', () => {
    expect(tierFromAge(7)).toBe('explorer');
    expect(tierFromAge(9)).toBe('explorer');
  });
  it('returns yogi for ages 10–18', () => {
    expect(tierFromAge(10)).toBe('yogi');
    expect(tierFromAge(12)).toBe('yogi');
    expect(tierFromAge(18)).toBe('yogi');
  });
  it('throws RangeError for age 0', () => {
    expect(() => tierFromAge(0)).toThrow(RangeError);
  });
  it('throws RangeError for age 19', () => {
    expect(() => tierFromAge(19)).toThrow(RangeError);
  });
  it('throws RangeError for negative age', () => {
    expect(() => tierFromAge(-5)).toThrow(RangeError);
  });
});

describe('vocabLevel', () => {
  it('returns animal-only for seedling', () => {
    expect(vocabLevel('seedling')).toBe('animal-only');
  });
  it('returns intro-sanskrit for explorer', () => {
    expect(vocabLevel('explorer')).toBe('intro-sanskrit');
  });
  it('returns full-sanskrit for yogi', () => {
    expect(vocabLevel('yogi')).toBe('full-sanskrit');
  });
});

describe('maxBreaths', () => {
  it('returns 6 for seedling', () => expect(maxBreaths('seedling')).toBe(6));
  it('returns 8 for explorer', () => expect(maxBreaths('explorer')).toBe(8));
  it('returns 10 for yogi',    () => expect(maxBreaths('yogi')).toBe(10));
});
