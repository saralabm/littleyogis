import { DEFAULT_HIT_SLOP, makeA11yLabel } from '../../src/utils/accessibility';

describe('DEFAULT_HIT_SLOP', () => {
  it('provides 8px on all sides', () => {
    expect(DEFAULT_HIT_SLOP).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
  });
});

describe('makeA11yLabel', () => {
  it('returns label when no hint', () => {
    expect(makeA11yLabel('Start session')).toBe('Start session');
  });
  it('combines label and hint', () => {
    expect(makeA11yLabel('Next pose', 'Advance to next pose')).toBe('Next pose. Advance to next pose');
  });
});
