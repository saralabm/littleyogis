import { ailments, breathingExercises } from '../../src/data/index';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const breathingIds = new Set(breathingExercises.map((b) => b.id));

describe('ailments data integrity', () => {
  it('exports exactly 16 ailments', () => {
    expect(ailments).toHaveLength(16);
  });

  ailments.forEach((ailment) => {
    describe(`ailment: ${ailment.id}`, () => {
      it('has a non-empty id', () => expect(ailment.id).toBeTruthy());
      it('has a valid category', () =>
        expect(['physical', 'emotional']).toContain(ailment.category));
      it('has a valid accentColor hex', () =>
        expect(ailment.accentColor).toMatch(HEX_COLOR));
      it('all recommendedBreathingIds exist', () => {
        ailment.recommendedBreathingIds.forEach((bid) =>
          expect(breathingIds.has(bid)).toBe(true)
        );
      });
    });
  });
});

describe('breathingExercises data integrity', () => {
  it('exports exactly 9 breathing exercises', () => {
    expect(breathingExercises).toHaveLength(9);
  });

  breathingExercises.forEach((ex) => {
    describe(`breathing: ${ex.id}`, () => {
      it('has two valid gradient colors', () => {
        expect(ex.gradientColors).toHaveLength(2);
        ex.gradientColors.forEach((c) => expect(c).toMatch(HEX_COLOR));
      });
      it('has a positive defaultCycles', () =>
        expect(ex.defaultCycles).toBeGreaterThan(0));
      it('cycle is non-empty', () =>
        expect(ex.cycle.length).toBeGreaterThan(0));
    });
  });
});
