# Changelog — Little Yogi Wellness

This changelog is reconstructed from the git history. Entries are organized into development phases based on commit message patterns. No dates are fabricated — the git log does not include timestamps here.

---

## Current State — Snapshot Save

**Commit:** `6a3349c` Save current Little Yogi Wellness app

All core features implemented and stabilized. App is functional at MVP/prototype level.

---

## Phase 6 — Age-Adaptive Feature Integration

Age-adaptive hooks applied to screens so the UI responds to the active tier.

- `2bef07a` — Apply `autoAdvanceSession` and `instructionFontSize` from `useAgeTheme` to `SessionPlayerScreen`
- `939a454` — Apply `useAgeContent` filtering and tier-appropriate pose names to `AilmentDetailScreen`
- `c8776e3` — Apply `useAgeTheme` accent color to `CategoryBrowserScreen` tab indicator
- `c2dd190` — Apply `useAgeTheme` background, streak, Yogi mascot, and font size to `HomeScreen`

---

## Phase 5 — Breathing Screens

Full breathing library and player screens implemented.

- `c37130f` — Implement `BreathingLibraryScreen`, `BreathingPlayerScreen`, `BreathingCompleteScreen`

---

## Phase 4B — Session and Profile Screens

- `855456e` — Implement `SessionPlayerScreen` with timer, controls, and `SessionCompleteScreen` with animated celebration

---

## Phase 4A — Age-Adaptive Features and Accessibility

- `91c5c88` — Add `useAgeTheme`, `useAgeContent`, `useParentGate`, `useDisclaimerState`, and accessibility utilities with tests
- `147a7c3` — Add `useBreathingPlayer` state machine hook with tests
- `f9a87de` — Add `BreathCounter`, `BreathPhaseArc`, `BreathingCircle` breathing components
- `abf21e4` — Upgrade all 8 breathing exercise stubs to full implementations (phases, instructions, gradients)
- `4fda8d5` — Add `HoldTimer`, `PoseDisplay`, `TransitionOverlay`, `ContraindicationAlert`, `PoseInstructions` session components
- `f896d23` — Add `useSessionPlayer` with timer, keep-awake, and audio integration with tests
- `d88297a` — Add `useHaptics` with `poseStart`, `stepComplete`, `cycleComplete`
- `3a2b33b` — Add `react-native-svg` dependency

---

## Phase 3B — Explore and Profile Screens

- `eae7b56` — Implement `AilmentDetailScreen` with pose scroll and session start; `ProfileScreen` with tier selector
- `7b06017` — Implement `HomeScreen` with mood selector and body map; `CategoryBrowserScreen` with tab toggle

---

## Phase 3A — Molecular Components

- `ab3e538` — Add `AilmentCard`, `BreathingCard`, `PoseCard`, `SafetyBanner`, `DisclaimerSheet`, `PinGate`
- `99d0c2a` — Add `Button`, `Card`, `ProgressBar`, `EmojiMood` atomic components

---

## Phase 2B — Navigation and Onboarding Screens

- `8244098` — Add 5 onboarding screens (`WelcomeScreen`, `AgeTierScreen`, `ChildProfileScreen`, `DisclaimerScreen`, `PinSetupScreen`), 9 stub screens, and wire `App.tsx` to `RootNavigator`
- `1aeb96f` — Add `MainTabNavigator` with 4 tabs (Home, Explore, Breathe, Me), `SessionPlayer` tab hide, and tier-adaptive tab accent
- `9e8f1dd` — Add `RootNavigator` with onboarding gate based on profile and disclaimer state
- `0cf0b16` — Add typed param lists for all navigators (`navigationTypes.ts`)

---

## Phase 2A — Stores and Session Logic

- `b7a64ec` — Add `useProgressStore` with AsyncStorage persistence and streak calculation with tests
- `1a0a9e7` — Add `useSessionStore` in-memory session state with tests

---

## Phase 1B — Data Layer

- `42d5294` — Add structural integrity tests for ailments and breathing exercises
- `ff97375` — Add `buildSession` with age-filtering, duration capping, and transition steps with tests
- `2208ef7` — Add `timeUtils` with `breathsToSeconds` and `formatDuration` with tests
- `c8a0865` — Add `poseNameUtils` with age-adaptive name formatting with tests
- `1d3299b` — Add `ageUtils` with `tierFromAge`, `vocabLevel`, `maxBreaths` with tests
- `aa1a73b` — Add data index with ailments/breathing arrays and lookup helpers
- `063e1e9` — Add balloon breathing (full implementation) + 8 breathing exercise stubs
- `f8edc57` — Add anxiety emotional ailment (full) + 14 ailment stubs
- `7c1a02c` — Add constipation physical ailment (full implementation)

---

## Phase 1A — Foundation

- `df38445` — Add spacing tokens and theme barrel export
- `218137e` — Add typography scale tokens
- `0fe3aa2` — Add color design tokens (`src/theme/colors.ts`)
- `6218d56` — Add all shared TypeScript interfaces and union types (`src/types/index.ts`)
- `c4d536d` — Scaffold full `src/` and `__tests__/` folder structure
- `c10634b` — Configure `babel-plugin-module-resolver` for path aliases
