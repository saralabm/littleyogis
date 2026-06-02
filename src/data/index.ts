import { Ailment, BreathingExercise } from '../types';

// Physical ailments
import { constipation } from './ailments/physical/constipation';
import { poorPosture } from './ailments/physical/poorPosture';
import { lowEnergy } from './ailments/physical/lowEnergy';
import { headaches } from './ailments/physical/headaches';
import { tightHamstrings } from './ailments/physical/tightHamstrings';
import { obesity } from './ailments/physical/obesity';
import { coordination } from './ailments/physical/coordination';
import { asthma } from './ailments/physical/asthma';

// Emotional ailments
import { anxiety } from './ailments/emotional/anxiety';
import { anger } from './ailments/emotional/anger';
import { hyperactivity } from './ailments/emotional/hyperactivity';
import { adhd } from './ailments/emotional/adhd';
import { sleepIssues } from './ailments/emotional/sleepIssues';
import { examStress } from './ailments/emotional/examStress';
import { emotionalOverwhelm } from './ailments/emotional/emotionalOverwhelm';
import { lowConfidence } from './ailments/emotional/lowConfidence';

// Breathing exercises
import { balloonBreathing } from './breathing/balloonBreathing';
import { bumblebeeBreath } from './breathing/bumblebeeBreath';
import { boxBreathing } from './breathing/boxBreathing';
import { dragonBreath } from './breathing/dragonBreath';
import { oceanBreathing } from './breathing/oceanBreathing';
import { rainbowBreathing } from './breathing/rainbowBreathing';
import { bellyBreathing } from './breathing/bellyBreathing';
import { starBreathing } from './breathing/starBreathing';
import { flowerBreathing } from './breathing/flowerBreathing';

export const ailments: Ailment[] = [
  constipation, poorPosture, lowEnergy, headaches,
  tightHamstrings, obesity, coordination, asthma,
  anxiety, anger, hyperactivity, adhd,
  sleepIssues, examStress, emotionalOverwhelm, lowConfidence,
];

export const breathingExercises: BreathingExercise[] = [
  balloonBreathing, bumblebeeBreath, boxBreathing, dragonBreath,
  oceanBreathing, rainbowBreathing, bellyBreathing, starBreathing,
  flowerBreathing,
];

export function getAilmentById(id: string): Ailment | undefined {
  return ailments.find((a) => a.id === id);
}

export function getBreathingById(id: string): BreathingExercise | undefined {
  return breathingExercises.find((b) => b.id === id);
}
