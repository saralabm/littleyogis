# Feature Specifications — Little Yogi Wellness

Each feature below is implemented in the current codebase unless marked otherwise.

---

## Feature 1: Age Tier System

**Purpose:** Adapt the entire app experience — language, visual complexity, session length, and content — to the child's developmental stage.

**User:** Child (indirectly), Parent (configures tier).

**Entry point:** AgeTierScreen during onboarding; ProfileScreen for updates.

**Functional behavior:**
- Three tiers: `seedling` (4–6), `explorer` (7–9), `yogi` (10–12).
- `useAgeTheme` returns an `AgeTheme` object keyed to the active tier:
  - Background color, accent color
  - Body/instruction font sizes
  - Whether to show the Yogi mascot and at what size
  - Whether to show the streak badge
  - Whether to show Sanskrit pose names
  - Whether to auto-advance through session steps
  - Timer style: `'jar'` (Seedling) or `'ring'` (Explorer/Yogi)
  - Whether to show the breath count
- `useAgeContent` returns:
  - `getPoseName(pose)` — animal name (Seedling), English+intro-Sanskrit (Explorer), full Sanskrit (Yogi)
  - `filterPosesForTier(poses)` — filters by `ageSuitability` matching the tier
  - `getInstructionText(pose)` — 5-word truncation (Seedling), 12-word (Explorer), full text (Yogi)
  - `maxSessionMinutes` — 10 (Seedling), 15 (Explorer), 20 (Yogi)
- Vocabulary levels: `'animal-only'` | `'intro-sanskrit'` | `'full-sanskrit'`
- Max hold breaths: 6 (Seedling), 8 (Explorer), 10 (Yogi)

**Relevant files:**
- `src/features/age-adaptive/useAgeTheme.ts`
- `src/features/age-adaptive/useAgeContent.ts`
- `src/store/useProfileStore.ts` — `TIER_CONFIG`
- `src/utils/ageUtils.ts`
- `src/utils/poseNameUtils.ts`

**Status:** Implemented.

---

## Feature 2: Onboarding Flow

**Purpose:** Configure the app for a specific child, accept a medical disclaimer, and optionally set a parent PIN — all before the child accesses any content.

**User:** Parent/Guardian.

**Entry point:** App first launch (no profile in SecureStore).

**Functional behavior:**
- 5-screen linear flow: Welcome → AgeTier → ChildProfile → Disclaimer → PinSetup.
- In-progress state saved to SecureStore via `onboardingDraft.ts` so the flow survives app kills.
- AgeTierScreen uses `accessibilityRole="radio"` on tier cards.
- DisclaimerScreen requires explicit acceptance tap before continuing.
- PinSetupScreen allows skip; if skipped, `profile.parentPin` remains undefined.
- On completion: `setProfile()` is called, creating the full `AgeProfile` in SecureStore.
- `RootNavigator` detects `hasAcceptedDisclaimer === true` and switches to the main stack.

**Relevant files:**
- `src/screens/onboarding/` (5 screen files)
- `src/screens/onboarding/onboardingDraft.ts`
- `src/navigation/RootNavigator.tsx`
- `src/store/useProfileStore.ts`
- `src/components/molecules/DisclaimerSheet.tsx`

**Status:** Implemented.

---

## Feature 3: Yoga Session Player

**Purpose:** Guide a child through a structured sequence of yoga poses tailored to their ailment and age tier.

**User:** Child.

**Entry point:** "Start Session" button on AilmentDetailScreen.

**Functional behavior:**
- `buildSession(ailment, profile)` constructs the session: filters poses for age range, caps hold times at `profile.maxHoldBreaths`, inserts 3-second transition steps between poses.
- `SessionPlayerScreen` receives the `Session` as a route param.
- `useSessionPlayer` manages: 1-second countdown interval, keep-awake lock, haptics on step start/complete, transition audio bell.
- `PoseDisplay` shows the pose name (tier-adaptive via `poseName()`) and a Lottie animation placeholder.
- `HoldTimer` renders a countdown in the tier-appropriate style: jar (Seedling) or ring (Explorer/Yogi).
- `PoseInstructions` shows `pose.howItHelps` with tier-adaptive truncation.
- `TransitionOverlay` covers the screen during 3-second transition steps.
- `ContraindicationAlert` shows once per pose per session if `pose.contraindications.length > 0`.
- Audio narration via `usePoseNarration` (expo-speech) is opt-in via a 🔊/🔇 toggle.
- Auto-advance fires when `secondsRemaining === 0` AND `autoAdvanceSession === true` (Seedling only).
- Quit confirmation via `Alert.alert` (no-op alert on web; direct quit).
- On completion: `recordCompletion` called, navigate to `SessionComplete` (replace, not push).

**Relevant files:**
- `src/screens/session/SessionPlayerScreen.tsx`
- `src/screens/session/SessionCompleteScreen.tsx`
- `src/hooks/useSessionPlayer.ts`
- `src/store/useSessionStore.ts`
- `src/utils/buildSession.ts`
- `src/components/session/` (5 components)
- `src/hooks/useHaptics.ts`
- `src/hooks/usePoseNarration.ts`

**Status:** Implemented. Audio bell MP3 files are stub (graceful fallback). Lottie assets are stub.

---

## Feature 4: Breathing Player

**Purpose:** Guide a child through timed breathing cycles with phase-by-phase instruction.

**User:** Child.

**Entry point:** BreathingLibraryScreen tile, or recommended breathing card on AilmentDetailScreen.

**Functional behavior:**
- `BreathingPlayerScreen` receives `{ exerciseId }` and looks up the exercise via `getBreathingById`.
- `useBreathingPlayer(exercise)` manages: phase-by-phase timeout scheduling, round counting, progress tracking (0–1 within current phase at 50ms resolution), pause/resume (clears and reschedules timers), skip round, and restart.
- `BreathingCircle` animates an SVG circle to visually represent the phase.
- `BreathPhaseArc` shows elapsed time within the current phase.
- `BreathCounter` displays current round and total rounds.
- Haptic: light impact on round completion, notification success on exercise completion.
- On completion: `isComplete` flag set; `BreathingCompleteScreen` navigation can be triggered.

**Relevant files:**
- `src/screens/breathing/BreathingLibraryScreen.tsx`
- `src/screens/breathing/BreathingPlayerScreen.tsx`
- `src/screens/breathing/BreathingCompleteScreen.tsx`
- `src/hooks/useBreathingPlayer.ts`
- `src/components/breathing/BreathingCircle.tsx`
- `src/components/breathing/BreathPhaseArc.tsx`
- `src/components/breathing/BreathCounter.tsx`

**Status:** Implemented. Full gradient rendering on BreathingPlayerScreen is a planned enhancement (currently solid background color).

---

## Feature 5: Ailment Library

**Purpose:** Let the child (or parent) browse 16 health conditions and navigate to the relevant yoga session.

**User:** Child (browsing), Parent (selecting on child's behalf).

**Entry point:** Explore tab, Home screen mood picker, Home screen body map.

**Functional behavior:**
- `CategoryBrowserScreen` shows a tab toggle (Physical / Emotional) and a 2-column `AilmentCard` grid for each category.
- Tab accent color reflects `useAgeTheme().accentColor`.
- `AilmentCard` displays: background from `ailment.accentColor`, emoji (top-right), child-friendly name (bottom).
- `AilmentDetailScreen` receives `{ ailmentId }` and loads the ailment via `getAilmentById`.
- Poses are filtered via `useAgeContent().filterPosesForTier`.
- Pose names use `useAgeContent().getPoseName`.
- `SafetyBanner` shown when `ailment.alwaysShowSafetyBanner === true`.
- Estimated session duration: `filteredPoses.length * 2.5` minutes (rounded).
- Difficulty label: "Easy" (Seedling), "Moderate" (Explorer), "Full" (Yogi).

**Relevant files:**
- `src/screens/explore/CategoryBrowserScreen.tsx`
- `src/screens/explore/AilmentDetailScreen.tsx`
- `src/data/ailments/` (16 files)
- `src/data/index.ts`
- `src/components/molecules/AilmentCard.tsx`
- `src/components/molecules/SafetyBanner.tsx`

**Status:** Implemented.

---

## Feature 6: Home Screen

**Purpose:** The child's primary daily entry point — quick access to sessions via mood or body area.

**User:** Child.

**Entry point:** Home tab (default after onboarding).

**Functional behavior:**
- Time-of-day greeting ("Good morning/afternoon/evening, [name]!").
- Streak badge shown for Explorer and Yogi tiers only.
- Yogi mascot (emoji placeholder) shown for Seedling (120px) and Explorer (64px).
- Mood picker: 6 emoji moods → navigate to matched ailment or category.
- Body map: 7 body zones as a white card list → navigate to matched ailment.
- Quick-access tiles: Breathing → `BreathingLibrary`; Bedtime → `AilmentDetail/sleep-issues`.
- "Explore All Yoga Sessions" button → `CategoryBrowser`.
- Settings button (⚙️) triggers PIN gate / `ProfileScreen`.

**Relevant files:**
- `src/screens/home/HomeScreen.tsx`
- `src/features/age-adaptive/useAgeTheme.ts`
- `src/store/useProgressStore.ts` (streak)

**Status:** Implemented.

---

## Feature 7: Progress Tracking and Streak

**Purpose:** Record every completed session and maintain a consecutive-day streak to encourage habit formation.

**User:** Child (streak visible), Parent (profile screen).

**Entry point:** Sessions complete automatically; streak displayed on HomeScreen and ProfileScreen.

**Functional behavior:**
- `recordCompletion(record: CompletedSession)` adds an entry to `completedSessions[]` and recalculates the streak.
- Streak algorithm: deduplicate practice days, sort descending, count consecutive days from today or yesterday backward.
- Streak resets to 0 if the most recent practice day is before yesterday.
- `updateSessionMoodRating(sessionId, rating)` — method implemented in store, no UI currently calls it.
- `calculateStreak()` — explicit recalculation trigger (used in tests and on store hydration).
- Data persisted to AsyncStorage (key: `healingstars-progress`).

**Relevant files:**
- `src/store/useProgressStore.ts`
- `src/types/index.ts` — `CompletedSession` interface

**Status:** Implemented. Mood rating UI not yet built.

---

## Feature 8: Parent Gate and PIN

**Purpose:** Protect parent settings from accidental or unauthorized changes by the child.

**User:** Parent.

**Entry point:** ⚙️ button on HomeScreen; Me tab.

**Functional behavior:**
- `PinGate` component (`src/components/molecules/PinGate.tsx`) renders a modal PIN entry UI.
- `useParentGate` manages verification and lockout state:
  - `verifyPin(entered)` — compares against `profile.parentPin`
  - `onWrongPin()` — increments fail count; on 3rd failure, sets a 30-second lockout
  - `isLocked()` — returns true if lockout is active
  - `remainingLockSeconds()` — countdown until lockout expires
- If no PIN was set during onboarding (`profile.parentPin === undefined`), the gate is skipped.
- PIN is stored in the SecureStore-backed profile.

**Relevant files:**
- `src/components/molecules/PinGate.tsx`
- `src/features/parent/useParentGate.ts`
- `src/features/parent/useDisclaimerState.ts`
- `src/store/useProfileStore.ts` — `setPin()`

**Status:** Implemented.

---

## Feature 9: Safety System

**Purpose:** Ensure children and parents are informed about medical limitations and contraindications before and during sessions.

**User:** Child, Parent.

**Entry points:** DisclaimerScreen (onboarding), AilmentDetailScreen (safety banner), SessionPlayerScreen (contraindication alert).

**Functional behavior:**
- **Disclaimer (onboarding):** `DisclaimerScreen` renders `DisclaimerSheet` (full medical disclaimer text). Acceptance calls `acceptDisclaimer()` which stores timestamp. Required before main app access.
- **Safety Banner:** `SafetyBanner` component shown on `AilmentDetailScreen` when `ailment.alwaysShowSafetyBanner === true`. Displays the ailment's `safetyNote`.
- **Contraindication Alert:** `ContraindicationAlert` component shown in `SessionPlayerScreen` when a pose has `contraindications.length > 0`. Shown at most once per pose per session (tracked via a `useRef` Set).

**Relevant files:**
- `src/screens/onboarding/DisclaimerScreen.tsx`
- `src/components/molecules/DisclaimerSheet.tsx`
- `src/components/molecules/SafetyBanner.tsx`
- `src/components/session/ContraindicationAlert.tsx`

**Status:** Implemented.
