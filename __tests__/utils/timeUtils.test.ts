import { breathsToSeconds, formatDuration } from '../../src/utils/timeUtils';

describe('breathsToSeconds', () => {
  it('uses 4s per breath for seedling', () => {
    expect(breathsToSeconds(5, 'seedling')).toBe(20);
  });
  it('uses 4s per breath for explorer', () => {
    expect(breathsToSeconds(5, 'explorer')).toBe(20);
  });
  it('uses 5s per breath for yogi', () => {
    expect(breathsToSeconds(5, 'yogi')).toBe(25);
  });
  it('handles 0 breaths', () => {
    expect(breathsToSeconds(0, 'seedling')).toBe(0);
  });
});

describe('formatDuration', () => {
  it('formats 0 seconds', () => expect(formatDuration(0)).toBe('0s'));
  it('formats under a minute', () => expect(formatDuration(30)).toBe('30s'));
  it('formats exactly 60 seconds', () => expect(formatDuration(60)).toBe('1m 0s'));
  it('formats 90 seconds', () => expect(formatDuration(90)).toBe('1m 30s'));
  it('formats 125 seconds', () => expect(formatDuration(125)).toBe('2m 5s'));
  it('formats 59 seconds as seconds only', () => expect(formatDuration(59)).toBe('59s'));
});
