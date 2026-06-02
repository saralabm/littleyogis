import { Pose, AgeTier } from '../types';

export function poseName(pose: Pose, tier: AgeTier): string {
  switch (tier) {
    case 'seedling':
      return pose.animalName ?? pose.englishName;
    case 'explorer':
      return `${pose.englishName} (${pose.sanskritName})`;
    case 'yogi':
      return `${pose.sanskritName} (${pose.englishName})`;
  }
}
