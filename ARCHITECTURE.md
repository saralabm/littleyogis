# Technical Architecture — Little Yogi Wellness

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| App framework | Expo | ~56.0.8 |
| UI runtime | React Native | 0.85.3 |
| UI library | React | 19.2.3 |
| Language | TypeScript | ~6.0.3 |
| State management | Zustand | ^4.5.7 |
| Navigation | React Navigation (native-stack + bottom-tabs) | v7 |
| Vector graphics | react-native-svg | 15.15.4 |
| Animations | lottie-react-native | ^7.3.8 |
| Audio | expo-av | ^16.0.8 |
| Text-to-speech | expo-speech | ~56.0.3 |
| Haptics | expo-haptics | ~56.0.3 |
| Screen wake | expo-keep-awake | ~56.0.3 |
| Secure storage | expo-secure-store | ~56.0.4 |
| Persistent storage | @react-native-async-storage/async-storage | ^3.1.1 |
| Fonts | @expo-google-fonts/nunito, nunito-sans, dm-mono | ^0.4.x |
| Test framework | Jest 29 + jest-expo | ^29.7.0 / ^56.0.4 |
| Test utilities | @testing-library/react-native | ^13.3.3 |

---

## Application Architecture

The app is a **single-stack Expo/React Native application** with no back-end. All state is stored on-device. All content is bundled with the app binary.

The top-level entry point (`App.tsx`) loads fonts via `expo-font`, then renders `RootNavigator`. The navigator decides whether to show the onboarding stack or the main app stack based on the profile's `hasAcceptedDisclaimer` flag from `useProfileStore`.

---

## Navigation Architecture

Navigation uses React Navigation v7 with a typed param list defined in `src/navigation/navigationTypes.ts`.

```
RootNavigator  (NativeStackNavigator<RootStackParamList>)
│
├── [Onboarding stack — when profile === null OR !hasAcceptedDisclaimer]
│   ├── Welcome          (no params)
│   ├── AgeTier          (no params)
│   ├── ChildProfile     (no params)
│   ├── Disclaimer       (no params)
│   └── PinSetup         (no params)
│
└── [Main app stack — after onboarding]
    ├── Main             → MainTabNavigator
    ├── SessionPlayer    → { session: Session }        (slides from bottom, no gesture dismiss)
    └── SessionComplete  → { session: Session; stepsCompleted: number }  (fade)
```

```
MainTabNavigator  (BottomTabNavigator<MainTabParamList>)
├── Home     (HomeScreen)
├── Explore  → ExploreStack
│             ├── CategoryBrowser  (no params)
│             └── AilmentDetail    → { ailmentId: string }
├── Breathe  → BreatheStack
│             ├── BreathingLibrary  (no params)
│             ├── BreathingPlayer   → { exerciseId: string }
│             └── BreathingComplete → { exerciseName: string; roundsCompleted: number }
└── Me       (ProfileScreen)
```

**Param type safety:** All navigator param lists are typed in `src/navigation/navigationTypes.ts`. Screen components import `RootStackParamList`, `ExploreStackParamList`, etc. to get typed `useRoute` and `useNavigation` hooks.

---

## Screen Architecture

| Screen | Path | Tab | Description |
|---|---|---|---|
| WelcomeScreen | `screens/onboarding/WelcomeScreen.tsx` | — | App intro with SVG hero illustration |
| AgeTierScreen | `screens/onboarding/AgeTierScreen.tsx` | — | Tier selection; saves draft to SecureStore |
| ChildProfileScreen | `screens/onboarding/ChildProfileScreen.tsx` | — | Name and optional character color |
| DisclaimerScreen | `screens/onboarding/DisclaimerScreen.tsx` | — | Medical disclaimer; calls `acceptDisclaimer()` |
| PinSetupScreen | `screens/onboarding/PinSetupScreen.tsx` | — | Optional 4-digit PIN; calls `setPin()` then `setProfile()` |
| HomeScreen | `screens/home/HomeScreen.tsx` | Home | Mood picker, body map, quick-access tiles |
| CategoryBrowserScreen | `screens/explore/CategoryBrowserScreen.tsx` | Explore | Physical/Emotional tab toggle; ailment grid |
| AilmentDetailScreen | `screens/explore/AilmentDetailScreen.tsx` | Explore | Pose list, session start, recommended breathing |
| SessionPlayerScreen | `screens/session/SessionPlayerScreen.tsx` | Modal | Full-screen session player |
| SessionCompleteScreen | `screens/session/SessionCompleteScreen.tsx` | Modal | Celebration + streak display |
| BreathingLibraryScreen | `screens/breathing/BreathingLibraryScreen.tsx` | Breathe | 3-column breathing exercise grid |
| BreathingPlayerScreen | `screens/breathing/BreathingPlayerScreen.tsx` | Breathe | Phase-by-phase breathing player |
| BreathingCompleteScreen | `screens/breathing/BreathingCompleteScreen.tsx` | Breathe | Completion summary |
| ProfileScreen | `screens/profile/ProfileScreen.tsx` | Me | Tier selector, streak display, reset option |

---

## Component Architecture

Components are organized into four layers under `src/components/`:

### Atoms (`components/atoms/`)

Primitive UI building blocks with no business logic.

| Component | Description |
|---|---|
| `Button` | Pill-shaped button; `primary` (gold fill) and `secondary` (outlined) variants |
| `Card` | Surface container; renders as `View` or `TouchableOpacity` when `onPress` is provided |
| `ProgressBar` | Animated horizontal fill bar; `accessibilityRole="progressbar"` |
| `EmojiMood` | Emoji mood display used in mood selector |

### Molecules (`components/molecules/`)

Composed components with data awareness but no navigation or store access.

| Component | Description |
|---|---|
| `AilmentCard` | 2-column grid card; background from `ailment.accentColor` |
| `BreathingCard` | 3-column grid card; background from `exercise.gradientColors[0]` |
| `PoseCard` | Card displaying a single pose in the AilmentDetail pose list |
| `SafetyBanner` | Yellow warning banner shown on ailments with medical considerations |
| `DisclaimerSheet` | Full disclaimer text component used in DisclaimerScreen |
| `PinGate` | Modal PIN entry; calls `useParentGate` for verification and lockout |

### Session (`components/session/`)

Components used exclusively within `SessionPlayerScreen`.

| Component | Description |
|---|---|
| `PoseDisplay` | Renders pose name (tier-adaptive) and Lottie animation placeholder |
| `HoldTimer` | Countdown timer; `jar` style (fill from bottom) for Seedling, `ring` style for others |
| `PoseInstructions` | Pose `howItHelps` text with tier-adaptive truncation |
| `TransitionOverlay` | Full-screen "rest" overlay shown during 3-second transition steps |
| `ContraindicationAlert` | Modal alert shown once per pose listing its contraindications |

### Breathing (`components/breathing/`)

Components used exclusively within `BreathingPlayerScreen`.

| Component | Description |
|---|---|
| `BreathingCircle` | Animated SVG circle that scales with breath phase |
| `BreathPhaseArc` | SVG arc progress indicator |
| `BreathCounter` | Round counter using DM Mono timer font |

---

## State Management

Three Zustand stores manage all application state.

### useProfileStore (`store/useProfileStore.ts`)

**Persisted to expo-secure-store** (key: `healingstars-profile`).

Holds the `AgeProfile` object:
- `tier: AgeTier` — `'seedling' | 'explorer' | 'yogi'`
- `ageRange: '4-6' | '7-9' | '10-12'`
- `vocabularyLevel: 'animal-only' | 'intro-sanskrit' | 'full-sanskrit'`
- `maxHoldBreaths: number` — per-tier cap on pose hold duration
- `preferredCharacterName?: string`
- `yogiColor?: string`
- `hasAcceptedDisclaimer: boolean`
- `disclaimerAcceptedAt?: number` (Unix timestamp)
- `parentPin?: string`

Actions: `setProfile`, `updateTier`, `updateName`, `acceptDisclaimer`, `setPin`, `resetProfile`.

`updateTier` also updates `ageRange`, `vocabularyLevel`, and `maxHoldBreaths` from the `TIER_CONFIG` constant.

### useProgressStore (`store/useProgressStore.ts`)

**Persisted to AsyncStorage** (key: `healingstars-progress`).

Holds:
- `completedSessions: CompletedSession[]` — full history
- `streakDays: number` — computed, stored for fast reads
- `lastPracticedAt: number | null` — Unix timestamp

Actions: `recordCompletion`, `updateSessionMoodRating`, `calculateStreak`.

Streak logic: deduplicate session days, sort descending, count consecutive days ending today or yesterday. Streak resets to 0 if the most recent practice day is before yesterday.

### useSessionStore (`store/useSessionStore.ts`)

**Not persisted** (in-memory only). Holds the active session state:
- `session: Session | null`
- `currentStepIndex: number`
- `secondsRemaining: number`
- `isPaused: boolean`

Actions: `startSession`, `nextStep`, `prevStep`, `pauseResume`, `tickTimer`, `endSession`.

---

## Hooks

### useSessionPlayer (`hooks/useSessionPlayer.ts`)

Orchestrates a running yoga session. Runs a 1-second `setInterval` for the countdown timer, activates `expo-keep-awake`, fires haptics on pose start and step completion, and plays the transition bell audio (graceful fallback if MP3 is absent). Calls `nextStep` automatically when `secondsRemaining` reaches 0.

Returns: `session`, `currentStep`, `currentStepIndex`, `totalSteps`, `secondsRemaining`, `isPaused`, `startSession`, `pauseResume`, `skipForward`, `skipBack`, `endSession`.

### useBreathingPlayer (`hooks/useBreathingPlayer.ts`)

Manages a phase-driven breathing session using `setTimeout`/`setInterval` (not Zustand — local state only). Tracks phase index, round count, and progress (0–1 within current phase at 50ms resolution). Handles pause/resume by clearing and rescheduling timers. Fires haptic light on round end and notification on exercise completion.

Returns: `currentPhase`, `currentRound`, `totalRounds`, `progress`, `isPaused`, `isComplete`, `pauseResume`, `restart`, `skipRound`.

### useAgeTheme (`features/age-adaptive/useAgeTheme.ts`)

Returns an `AgeTheme` object keyed to the active tier. Properties: `backgroundColor`, `accentColor`, `bodyFontSize`, `instructionFontSize`, `showYogi`, `yogiSize`, `showStreak`, `showSanskrit`, `autoAdvanceSession`, `timerStyle`, `showBreathCount`. Falls back to `'explorer'` if no profile exists.

### useAgeContent (`features/age-adaptive/useAgeContent.ts`)

Returns content-filtering utilities: `getPoseName(pose)`, `filterPosesForTier(poses)`, `getInstructionText(pose)`, `maxSessionMinutes`. Suitability filter maps tiers to accepted `ageSuitability` values (`'both' | '4-6' | '7-9' | '10-12'`).

### useParentGate (`features/parent/useParentGate.ts`)

PIN verification logic: `verifyPin(entered)`, `onWrongPin()` (increments fail count, sets lockout on 3rd failure), `isLocked()`, `remainingLockSeconds()`. Lockout duration is 30 seconds; max attempts before lockout is 3.

### useDisclaimerState (`features/parent/useDisclaimerState.ts`)

Reads disclaimer acceptance status from `useProfileStore`. Used to gate the disclaimer-required screens.

### useHaptics (`hooks/useHaptics.ts`)

Thin wrapper around `expo-haptics`. Provides `poseStart()` (medium impact), `stepComplete()` (light impact), `cycleComplete()` (notification success).

### usePoseNarration (`hooks/usePoseNarration.ts`)

Calls `expo-speech` to read pose names and transition cues aloud. Accepts an `enabled` flag; when disabled, is a no-op. Methods: `narratePose(pose, tier)`, `narrateTransition(nextPoseName)`, `stop()`.

---

## Data / Content Architecture

All content is static TypeScript modules bundled with the app. There is no CMS or remote data fetch.

### Ailment Data (`src/data/ailments/`)

16 ailments split into `physical/` and `emotional/` subdirectories. Each file exports a typed `Ailment` object. The barrel file `src/data/index.ts` re-exports all ailments as the `ailments` array and provides `getAilmentById(id)`.

Physical: `constipation`, `poorPosture`, `lowEnergy`, `headaches`, `tightHamstrings`, `obesity`, `coordination`, `asthma`.

Emotional: `anxiety`, `anger`, `hyperactivity`, `adhd`, `sleepIssues`, `examStress`, `emotionalOverwhelm`, `lowConfidence`.

### Breathing Exercise Data (`src/data/breathing/`)

9 exercises, each a typed `BreathingExercise` object. Barrel export includes `breathingExercises` array and `getBreathingById(id)`.

Exercises: `balloonBreathing`, `bumblebeeBreath`, `boxBreathing`, `dragonBreath`, `oceanBreathing`, `rainbowBreathing`, `bellyBreathing`, `starBreathing`, `flowerBreathing`.

### Age-Tier Content Filtering

`useAgeContent.filterPosesForTier` uses `TIER_SUITABILITY` to filter poses:
- `seedling` → accepts `ageSuitability === 'both'` or `'4-6'`
- `explorer` → accepts `'both'` or `'7-9'`
- `yogi` → accepts `'both'` or `'10-12'`

### Session Construction (`utils/buildSession.ts`)

`buildSession(ailment, profile)` filters eligible poses for the profile's `ageRange`, computes per-pose hold time using `breathsToSeconds(cappedBreaths, tier)` with the profile's `maxHoldBreaths` cap, inserts 3-second transition steps between poses, and returns a typed `Session` with a unique ID.

---

## Persistence

| Store | Backend | Key | What's stored |
|---|---|---|---|
| `useProfileStore` | expo-secure-store | `healingstars-profile` | Full `AgeProfile` including PIN |
| `useProgressStore` | AsyncStorage | `healingstars-progress` | `completedSessions[]`, `streakDays`, `lastPracticedAt` |
| `useSessionStore` | None (in-memory) | — | Active session state only |

Onboarding in-progress state is saved separately via `onboardingDraft.ts` to SecureStore, allowing partial onboarding to survive app kills.

---

## Testing Architecture

Tests live in `__tests__/` with the same subdirectory structure as `src/`:

```
__tests__/
├── data/         ailments.test.ts (structural integrity)
├── features/     useAgeTheme.test.ts, useParentGate.test.ts
├── hooks/        useBreathingPlayer.test.ts, useSessionPlayer.test.ts
├── screens/      placeholder.test.ts
├── store/        useProfileStore.test.ts, useProgressStore.test.ts, useSessionStore.test.ts
└── utils/        accessibility.test.ts, ageUtils.test.ts, buildSession.test.ts,
                  poseNameUtils.test.ts, timeUtils.test.ts
```

Test runner: `jest-expo` preset. Path aliases are mapped via `moduleNameMapper` in `jest.config.js` to match the `babel-plugin-module-resolver` aliases used in source.

---

## Key Technical Decisions

| Decision | Rationale |
|---|---|
| Zustand over Redux | Minimal boilerplate for small-to-medium store; built-in `persist` middleware for storage |
| SecureStore for profile | PIN is stored in profile; SecureStore provides OS-level encryption |
| AsyncStorage for progress | Less sensitive data; larger potential payload; SecureStore has size limits |
| In-memory session store | Session state is ephemeral; no persistence needed or desired |
| All content as TypeScript modules | Type-safe at authoring time; no serialization/deserialization overhead; no network dependency |
| `useBreathingPlayer` as local state | Breathing player uses `setTimeout`/`setInterval` directly, which doesn't benefit from Zustand's synchronous update model |
| `expo-speech` for narration | No audio assets needed for narration; text-to-speech is adequate for accessibility-style guidance |
| `babel-plugin-module-resolver` | Provides `@components`, `@data`, etc. path aliases so imports survive directory restructuring |
