import type { NavigatorScreenParams } from '@react-navigation/native';

export type ExploreStackParamList = {
  CategoryBrowser: undefined;
  AilmentDetail: { ailmentId: string };
};

export type BreatheStackParamList = {
  BreathingLibrary: undefined;
  BreathingPlayer: { exerciseId: string };
  BreathingComplete: { exerciseName: string; roundsCompleted: number };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: NavigatorScreenParams<ExploreStackParamList>;
  Breathe: NavigatorScreenParams<BreatheStackParamList>;
  Me: undefined;
};

export type RootStackParamList = {
  // Onboarding
  Welcome: undefined;
  AgeTier: undefined;
  ChildProfile: undefined;
  Disclaimer: undefined;
  PinSetup: undefined;
  // Main app
  Main: NavigatorScreenParams<MainTabParamList>;
  // Modal screens
  SessionPlayer: { session: import('../types').Session };
  SessionComplete: { session: import('../types').Session; stepsCompleted: number };
};
