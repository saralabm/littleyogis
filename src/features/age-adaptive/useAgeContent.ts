import { useProfileStore } from '../../store/useProfileStore';
import type { AgeTier, Pose } from '../../types';
import { poseName } from '../../utils/poseNameUtils';

interface AgeContentHook {
  getPoseName: (pose: Pose) => string;
  filterPosesForTier: (poses: Pose[]) => Pose[];
  getInstructionText: (pose: Pose) => string;
  maxSessionMinutes: number;
}

const TIER_SUITABILITY: Record<AgeTier, Array<Pose['ageSuitability']>> = {
  seedling: ['both', '4-6'],
  explorer: ['both', '7-9'],
  yogi: ['both', '10-12'],
};

const MAX_SESSION_MINUTES: Record<AgeTier, number> = {
  seedling: 10, explorer: 15, yogi: 20,
};

function truncateWords(text: string, max: number): string {
  const words = text.split(' ');
  if (words.length <= max) return text;
  return words.slice(0, max).join(' ') + '…';
}

export function useAgeContent(): AgeContentHook {
  const profile = useProfileStore((s) => s.profile);
  const tier: AgeTier = profile?.tier ?? 'explorer';

  return {
    getPoseName: (pose) => poseName(pose, tier),
    filterPosesForTier: (poses) => poses.filter((p) => TIER_SUITABILITY[tier].includes(p.ageSuitability)),
    getInstructionText: (pose) => {
      if (tier === 'seedling') return truncateWords(pose.howItHelps, 5);
      if (tier === 'explorer') return truncateWords(pose.howItHelps, 12);
      return pose.howItHelps;
    },
    maxSessionMinutes: MAX_SESSION_MINUTES[tier],
  };
}
