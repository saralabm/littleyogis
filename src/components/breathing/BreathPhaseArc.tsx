import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { BreathingExercise } from '../../types';

interface BreathPhaseArcProps {
  exercise: BreathingExercise;
  currentPhaseIndex: number;
  phaseProgress: number; // 0–1
}

const OUTER_SIZE = 280;
const STROKE_WIDTH = 6;
const RADIUS = (OUTER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = OUTER_SIZE / 2;
const GAP_DEGREES = 4;

const PHASE_COLORS: Record<string, string> = {
  inhale: '#80CBC4',
  hold: '#42A5F5',
  holdAfterExhale: '#42A5F5',
  exhale: '#FFAB76',
};

export function BreathPhaseArc({ exercise, currentPhaseIndex, phaseProgress }: BreathPhaseArcProps) {
  const phases = exercise.cycle;
  const count = phases.length;
  const totalGap = GAP_DEGREES * count;
  const availDeg = 360 - totalGap;
  const degPerPhase = availDeg / count;
  const arcPerPhase = (degPerPhase / 360) * CIRCUMFERENCE;

  return (
    <View testID="breath-phase-arc">
      <Svg width={OUTER_SIZE} height={OUTER_SIZE}>
        {phases.map((phase, index) => {
          const startDeg = index * (degPerPhase + GAP_DEGREES) - 90;
          const rotation = startDeg + 90;

          // Background track
          const bgDash = `${arcPerPhase} ${CIRCUMFERENCE - arcPerPhase}`;
          // Fill amount
          let fillFraction = 0;
          if (index < currentPhaseIndex) fillFraction = 1;
          else if (index === currentPhaseIndex) fillFraction = phaseProgress;
          const fillLen = arcPerPhase * fillFraction;
          const fillDash = `${fillLen} ${CIRCUMFERENCE - fillLen}`;
          const color = PHASE_COLORS[phase.phase] ?? '#80CBC4';

          return (
            <React.Fragment key={`phase-${index}`}>
              <Circle
                testID="arc-segment"
                cx={CENTER} cy={CENTER} r={RADIUS} fill="none"
                stroke="rgba(255,255,255,0.15)" strokeWidth={STROKE_WIDTH}
                strokeDasharray={bgDash} strokeDashoffset={0} strokeLinecap="round"
                transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
              />
              <Circle
                cx={CENTER} cy={CENTER} r={RADIUS} fill="none"
                stroke={color} strokeWidth={STROKE_WIDTH}
                strokeDasharray={fillDash} strokeDashoffset={0} strokeLinecap="round"
                transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
