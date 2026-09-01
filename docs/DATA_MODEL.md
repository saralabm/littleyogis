# Data Model — Little Yogi Wellness

This document covers the application's runtime state model: Zustand stores, feature hooks, TypeScript types, and persistence strategy. For the content/wellness data model (ailments, poses, breathing exercises), see [CONTENT_MODEL.md](CONTENT_MODEL.md).

---

## Overview

The app uses three distinct state stores plus local hook state:

| Store | Persistence | Backend | Key |
|---|---|---|---|
| `useProfileStore` | Persistent | expo-secure-store | `healingstars-profile` |
| `useProgressStore` | Persistent | AsyncStorage | `healingstars-progress` |
| `useSessionStore` | In-memory | None | — |

All stores are built with [Zustand](https://github.com/pmndrs/zustand). Persistent stores use the `persist` middleware with `createJSONStorage`.

---

## Profile Store (`src/store/useProfileStore.ts`)

### What it stores

The `AgeProfile` object representing the configured child/session.

```ts
interface AgeProfile {
  tier: AgeTier;                    // 'seedling' | 'explorer' | 'yogi'
  ageRange: '4-6' | '7-9' | '10-12';
  vocabularyLevel: VocabularyLevel; // 'animal-only' | 'intro-sanskrit' | 'full-sanskrit'
  maxHoldBreaths: number;           // Per-tier cap on pose hold duration
  preferredCharacterName?: string;  // Child's preferred name (set in ChildProfileScreen)
  yogiColor?: string;               // Optional character color (set in ChildProfileScreen)
  hasAcceptedDisclaimer: boolean;   // Disclaimer acceptance flag
  disclaimerAcceptedAt?: number;    // Unix timestamp of disclaimer acceptance
  parentPin?: string;               // 4-digit PIN string (optional)
}
```

### Store state and actions

```ts
interface ProfileState {
  profile: AgeProfile | null;
  setProfile: (profile: AgeProfile) => void;       // Full profile creation
  updateTier: (tier: AgeTier) => void;              // Change tier + update derived fields
  updateName: (name: string) => void;               // Update preferredCharacterName
  acceptDisclaimer: () => void;                     // Set hasAcceptedDisclaimer + timestamp
  setPin: (pin: string) => void;                    // Set or update parentPin
  resetProfile: () => void;                         // Clear profile (returns to onboarding)
}
```

`updateTier` derives `ageRange`, `vocabularyLevel`, and `maxHoldBreaths` from `TIER_CONFIG`:

```ts
const TIER_CONFIG = {
  seedling: { ageRange: '4-6',   vocabularyLevel: 'animal-only',    maxHoldBreaths: 6 },
  explorer: { ageRange: '7-9',   vocabularyLevel: 'intro-sanskrit', maxHoldBreaths: 8 },
  yogi:     { ageRange: '10-12', vocabularyLevel: 'full-sanskrit',  maxHoldBreaths: 10 },
}
```

### Persistence

Persisted to **expo-secure-store** (OS-level encrypted key-value store). This is appropriate because the profile contains a PIN, which is sensitive data.

Storage adapter:
```ts
const secureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};
```

### Usage in app

- `RootNavigator` reads `profile.hasAcceptedDisclaimer` to decide whether to show onboarding or the main app.
- `useAgeTheme` and `useAgeContent` read `profile.tier`.
- `buildSession` reads `profile.ageRange` and `profile.maxHoldBreaths`.
- `SessionPlayerScreen` reads `profile.tier` for pose name rendering.
- `HomeScreen` reads `profile.preferredCharacterName` for the greeting.

---

## Progress Store (`src/store/useProgressStore.ts`)

### What it stores

The child's session history and streak.

```ts
interface CompletedSession {
  sessionId: string;          // Matches Session.id (ailmentId + tier + timestamp)
  ailmentId: string;
  completedAt: number;        // Unix timestamp
  durationSeconds: number;
  stepsCompleted: number;
  totalSteps: number;
  moodRating?: number;        // Optional post-session mood (1–5); store ready, no UI yet
}

interface ProgressState {
  completedSessions: CompletedSession[];
  streakDays: number;
  lastPracticedAt: number | null;
  recordCompletion: (record: CompletedSession) => void;
  updateSessionMoodRating: (sessionId: string, rating: number) => void;
  calculateStreak: () => void;
}
```

### Streak calculation

`computeStreak(sessions)` is a pure function:
1. Extract unique practice days (deduplicate sessions on the same calendar day using `startOfDay(ms)`).
2. Sort days descending.
3. If the most recent day is before yesterday, return 0.
4. Count consecutive days (each day must be exactly 86,400,000ms before the previous).

### Persistence

Persisted to **AsyncStorage** (unencrypted key-value store). Used instead of SecureStore because: (a) progress data is not sensitive, (b) AsyncStorage supports larger payloads than SecureStore's practical limits, (c) progress history may grow over time.

---

## Session Store (`src/store/useSessionStore.ts`)

### What it stores

The active session state during a yoga session. **Not persisted** — state is lost when the app is killed during a session.

```ts
interface SessionState {
  session: Session | null;
  currentStepIndex: number;
  secondsRemaining: number;
  isPaused: boolean;
}
```

### Actions

```ts
startSession(session: Session): void   // Load session, reset index and timer to step[0]
nextStep(): void                       // Advance index, reset timer to next step duration
prevStep(): void                       // Go back one step, reset timer
pauseResume(): void                    // Toggle isPaused
tickTimer(): void                      // Decrement secondsRemaining by 1 (called by interval)
endSession(): void                     // Clear session and reset all state
```

`tickTimer` is a no-op when `isPaused === true` or `secondsRemaining <= 0`.

### Usage

`useSessionPlayer` (hook) drives this store: it runs a 1-second `setInterval` that calls `tickTimer`, and monitors `secondsRemaining === 0` to call `nextStep`.

---

## Session and Step Types (`src/types/index.ts`)

```ts
interface Session {
  id: string;                 // "${ailmentId}-${tier}-${Date.now()}"
  ailmentId: string;
  ageTier: AgeTier;
  steps: SessionStep[];
  totalDurationSeconds: number;
}

interface SessionStep {
  type: 'pose' | 'transition' | 'breathing';
  poseId?: string;            // Present when type === 'pose'
  breathingId?: string;       // Present when type === 'breathing' (not used by buildSession currently)
  durationSeconds: number;
  instructionText: string;
}
```

Sessions are constructed by `buildSession(ailment, profile)` in `src/utils/buildSession.ts` and passed as a navigation param to `SessionPlayerScreen`. They are not stored anywhere after `endSession` is called except through the `CompletedSession` record in the progress store.

---

## Onboarding Draft State (`src/screens/onboarding/onboardingDraft.ts`)

During onboarding, partial state is saved to SecureStore so the flow can resume after an app kill. This is separate from `useProfileStore` — the draft holds the in-progress tier/name values before `setProfile` is called on the final PinSetup screen.

---

## Type Definitions (`src/types/index.ts`)

All shared TypeScript interfaces and union types are in a single barrel file:

```ts
type AgeTier = 'seedling' | 'explorer' | 'yogi';
type AgeRange = '4-6' | '7-9' | '10-12' | 'both';
type AilmentCategory = 'physical' | 'emotional';
type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';
type VocabularyLevel = 'animal-only' | 'intro-sanskrit' | 'full-sanskrit';

interface Pose { ... }
interface Ailment { ... }
interface BreathCycle { ... }
interface BreathingExercise { ... }
interface AgeProfile { ... }
interface SessionStep { ... }
interface Session { ... }
interface CompletedSession { ... }
```

See [CONTENT_MODEL.md](CONTENT_MODEL.md) for the content-facing types (`Pose`, `Ailment`, `BreathCycle`, `BreathingExercise`).

---

## Feature Hook State (Local, Not Zustand)

### `useBreathingPlayer` local state

`useBreathingPlayer` manages breathing player state locally (not in Zustand) because the breathing session is self-contained and does not need to persist:

| State | Type | Description |
|---|---|---|
| `phaseIndex` | `number` | Index into `exercise.cycle[]` |
| `round` | `number` | Current round (1-based) |
| `isPaused` | `boolean` | Whether phase timer is suspended |
| `isComplete` | `boolean` | Whether all rounds are done |
| `progress` | `number` | 0–1 progress within the current phase |

Ref versions (`phaseIndexRef`, etc.) exist alongside state to avoid stale closure issues in setTimeout/setInterval callbacks.

### `useParentGate` local state

`useParentGate` manages PIN gate state locally:

| State | Type | Description |
|---|---|---|
| `failCount` | `number` | Wrong PIN attempts |
| `lockedUntil` | `number \| null` | Lockout expiry timestamp |

Lockout constant: 30,000ms (30 seconds). Max attempts before lockout: 3.

---

## Persistence Summary

| Data | Backend | Encrypted | Survives app kill? | Survives device restart? |
|---|---|---|---|---|
| AgeProfile (tier, name, PIN) | SecureStore | Yes | Yes | Yes |
| CompletedSessions, streak | AsyncStorage | No | Yes | Yes |
| Active session (step index, timer) | Memory | N/A | No | No |
| Onboarding draft | SecureStore | Yes | Yes | Yes |
| Breathing player state | Memory | N/A | No | No |
