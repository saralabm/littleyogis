import { AgeTier } from '../types';

const SECONDS_PER_BREATH: Record<AgeTier, number> = {
  seedling: 4,
  explorer: 4,
  yogi: 5,
};

export function breathsToSeconds(breaths: number, tier: AgeTier): number {
  return breaths * SECONDS_PER_BREATH[tier];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
