import { Ailment, AgeProfile, Session, SessionStep, Pose } from '../types';
import { breathsToSeconds } from './timeUtils';

function isPoseEligible(pose: Pose, profile: AgeProfile): boolean {
  return pose.ageSuitability === 'both' || pose.ageSuitability === profile.ageRange;
}

export function buildSession(ailment: Ailment, profile: AgeProfile): Session {
  const eligiblePoses = ailment.poses.filter((p) => isPoseEligible(p, profile));
  const steps: SessionStep[] = [];

  eligiblePoses.forEach((pose, index) => {
    const cappedBreaths = Math.min(pose.holdTimeBreaths.max, profile.maxHoldBreaths);
    const durationSeconds = breathsToSeconds(cappedBreaths, profile.tier);

    steps.push({
      type: 'pose',
      poseId: pose.id,
      durationSeconds,
      instructionText: pose.howItHelps,
    });

    if (index < eligiblePoses.length - 1) {
      steps.push({
        type: 'transition',
        durationSeconds: 3,
        instructionText: 'Get ready for the next pose...',
      });
    }
  });

  const totalDurationSeconds = steps.reduce((sum, s) => sum + s.durationSeconds, 0);

  return {
    id: `${ailment.id}-${profile.tier}-${Date.now()}`,
    ailmentId: ailment.id,
    ageTier: profile.tier,
    steps,
    totalDurationSeconds,
  };
}
