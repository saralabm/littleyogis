# User Flows — Little Yogi Wellness

These flows document the actual navigation paths through the app as implemented in `src/screens/` and `src/navigation/`. Screen names match the components in the codebase.

---

## Flow 1: First Launch and Onboarding

**Trigger:** App opens for the first time with no profile in SecureStore.

`RootNavigator` detects `profile === null` and renders the onboarding stack.

1. **WelcomeScreen** — Parent sees the app title ("Healing Stars"), a hero SVG illustration, and a notice: "This section is for parents & guardians." Parent taps "Let's Get Started."
2. **AgeTierScreen** — Parent sees three tier cards (Seedling ages 4–6, Explorer 7–9, Yogi 10–12). Parent taps one to select, taps Continue.
3. **ChildProfileScreen** — Parent enters the child's preferred name. Optional character color (not fully determinable from the code). Taps Continue.
4. **DisclaimerScreen** — Parent reads the full medical disclaimer rendered by `DisclaimerSheet`. Taps Accept.
5. **PinSetupScreen** — Parent enters a 4-digit PIN or taps Skip. On complete, calls `setPin()` and `setProfile()` on `useProfileStore`.
6. **Transition** — `RootNavigator` detects `profile !== null && hasAcceptedDisclaimer === true` and switches to the main stack. `HomeScreen` renders.

---

## Flow 2: Returning User Launch

**Trigger:** App opens with an existing profile in SecureStore where `hasAcceptedDisclaimer === true`.

1. App cold-starts; `useProfileStore` rehydrates from SecureStore.
2. `RootNavigator` renders the main stack immediately.
3. **HomeScreen** is the first screen.

---

## Flow 3: Home Screen — Mood-Driven Navigation

**Trigger:** Child is on HomeScreen and wants to address an emotion.

1. Child sees the mood picker row: 😊 Happy, 😤 Grumpy, 😔 Sad, 😰 Worried, 😴 Sleepy, 🤕 Hurty.
2. Child taps a mood:
   - **Grumpy** → navigates to `AilmentDetail` for `anger`
   - **Sad** → navigates to `AilmentDetail` for `low-confidence`
   - **Worried** → navigates to `AilmentDetail` for `anxiety`
   - **Sleepy** → navigates to `AilmentDetail` for `sleep-issues`
   - **Hurty** → navigates to `CategoryBrowser` with Physical tab preselected
   - **Happy** → navigates to `CategoryBrowser` (no preselection)
3. **AilmentDetailScreen** or **CategoryBrowserScreen** loads.

---

## Flow 4: Home Screen — Body Map Navigation

**Trigger:** Child taps a body zone.

1. Child sees the body map list: Head → `headaches`, Chest/Breath → `asthma`, Tummy → `constipation`, Back → `poor-posture`, Legs → `tight-hamstrings`, Low Energy → `low-energy`, Strength → `weight-support`.
2. Child taps a zone.
3. **AilmentDetailScreen** loads with the matched ailment.

---

## Flow 5: Explore — Browse by Category

**Trigger:** Child taps the Explore tab or "Explore All Yoga Sessions" button.

1. **CategoryBrowserScreen** loads. Default tab is Physical.
2. Child taps Physical or Emotional tab to filter the grid.
3. Ailment grid shows `AilmentCard` tiles (color-coded, with emoji).
4. Child taps an ailment card.
5. **AilmentDetailScreen** loads.

---

## Flow 6: Ailment Detail and Session Start

**Trigger:** Child is on AilmentDetailScreen.

1. Screen shows: hero image (ailment emoji on accent color background), child-friendly name, display name, estimated session duration and difficulty.
2. If `ailment.alwaysShowSafetyBanner === true`, a `SafetyBanner` is shown.
3. Pose list shows `PoseCard` tiles filtered for the active tier via `filterPosesForTier`. Pose names rendered using `poseName(pose, tier)`.
4. If a recommended breathing exercise exists, a `BreathingCard` is shown.
5. Child (or parent watching) taps "Start Session".
6. `buildSession(ailment, profile)` constructs a `Session` object.
7. Navigation pushes `SessionPlayer` with the session as a param (slides from bottom, gesture dismiss disabled).

---

## Flow 7: Yoga Session

**Trigger:** SessionPlayerScreen receives a `Session` param.

1. Screen mounts; `startSession(session)` is called on `useSessionStore`.
2. Screen wake lock activated (`expo-keep-awake`).
3. If audio is enabled, start bell plays.
4. For the first pose step: `ContraindicationAlert` is shown if the pose has contraindications (shown once per pose per session).
5. **Pose step:** `PoseDisplay` (pose name + animation placeholder), `HoldTimer` (countdown), `PoseInstructions` (how-it-helps text). Timer counts down from `step.durationSeconds`.
6. Timer reaches 0 → transition bell sound, haptic, auto-advance to next step.
   - **Seedling tier:** `autoAdvanceSession: true` → step advances automatically.
   - **Explorer/Yogi:** step does not advance until child taps ▶▶ (or timer fires).
7. **Transition step:** `TransitionOverlay` covers the screen ("Get ready for the next pose...") for 3 seconds.
8. Steps cycle until the final step completes.
9. `recordCompletion` is called on `useProgressStore`; streak is recalculated.
10. Navigation replaces `SessionPlayer` with `SessionComplete` (fade animation).

**Controls:**
- ◀◀ — `skipBack()` — go to previous step
- ⏸/▶ — `pauseResume()` — pause/resume timer
- ▶▶ — `skipForward()` — advance to next step
- ✕ Quit — `Alert.alert` confirmation → end session and `navigation.goBack()`
- 🔊/🔇 — toggle audio narration

---

## Flow 8: Session Complete

**Trigger:** SessionCompleteScreen receives `{ session, stepsCompleted }`.

1. Animated celebration screen shows.
2. Updated streak count is displayed.
3. Child can tap to return to Home or Explore.

---

## Flow 9: Breathing Library and Player

**Trigger:** Child taps the Breathe tab or the "Breathing" quick-access tile on HomeScreen.

1. **BreathingLibraryScreen** shows 9 `BreathingCard` tiles in a 3-column grid.
2. Child taps a card.
3. **BreathingPlayerScreen** loads with `{ exerciseId }` param.
4. `useBreathingPlayer` starts automatically — first phase begins immediately.
5. Screen shows: exercise name, phase label (e.g., "Breathe in…"), animated `BreathingCircle`, `BreathPhaseArc` progress, round counter.
6. Phases cycle automatically. At the end of each round, a light haptic fires.
7. After `exercise.defaultCycles` rounds, a success haptic fires and the player marks itself complete.
8. Navigation pushes **BreathingCompleteScreen** with `{ exerciseName, roundsCompleted }`.

**Controls:**
- Pause/Resume — toggles phase timer
- Restart — restarts from round 1
- Skip Round — advances to the next round immediately

---

## Flow 10: Parent Settings Access

**Trigger:** Parent (or child) taps ⚙️ on HomeScreen, or navigates to the Me tab.

1. If `profile.parentPin` is set, `PinGate` modal appears.
2. Parent enters 4 digits.
   - **Correct PIN:** `PinGate` dismisses; `ProfileScreen` is shown.
   - **Wrong PIN (< 3 times):** Error message shown; try again.
   - **Wrong PIN (3 times):** 30-second lockout. Countdown shown.
3. If no PIN was set, `ProfileScreen` is shown directly.
4. **ProfileScreen** shows: child name, current tier, streak count.
5. Parent can tap a different tier card → `updateTier(newTier)` — takes effect immediately.
6. Parent can tap Reset Profile → `resetProfile()` → app returns to onboarding.

---

## Flow 11: Recommended Breathing from Ailment Detail

**Trigger:** Child taps the recommended breathing card on AilmentDetailScreen.

1. AilmentDetailScreen shows a `BreathingCard` for `ailment.recommendedBreathingIds[0]`.
2. Child taps it.
3. Navigation goes to `BreathingPlayer` with `{ exerciseId }`.
4. Flow continues as Flow 9 from step 4.
