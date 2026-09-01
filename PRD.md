# Product Requirements Document — Little Yogi Wellness

---

## Product Vision

Little Yogi Wellness makes yoga and mindful breathing accessible to children ages 4–12 by adapting the experience to each child's developmental stage. The app translates yoga and wellness practices into age-appropriate language, session lengths, and visual complexity so that young children and older children alike find it approachable and useful.

---

## Problem Statement

Yoga and mindfulness tools designed for adults are difficult for children to engage with — the language is too abstract, sessions are too long, and the content assumes prior knowledge. Parents seeking wellness support for their children lack structured, safe, child-friendly resources that can be used independently at home without constant supervision.

---

## Product Goals

1. Provide age-appropriate guided yoga sessions for physical and emotional wellbeing.
2. Give parents confidence through safety features: medical disclaimer, contraindication alerts, and a PIN-protected settings area.
3. Keep the child experience simple, playful, and self-contained.
4. Support habit formation through streak tracking.
5. Adapt content, language, and UI complexity automatically to the child's age tier.

---

## Target Users

### Primary User: The Child (ages 4–12)

The child uses the app independently after a parent completes onboarding. They interact with the mood picker, body map, yoga sessions, and breathing exercises.

**Sub-personas by age tier:**

| Tier | Label | Age Range | Developmental Context |
|---|---|---|---|
| Seedling | Little Yogi | 4–6 | Pre-reader or early reader. Needs large text, simple language (animal pose names), a mascot for warmth, and auto-advancing sessions that don't require manual taps. |
| Explorer | Explorer Yogi | 7–9 | Independent reader. Can handle moderate complexity, introduction of some Sanskrit terms, streak tracking as motivation, manual session control. |
| Yogi | Warrior Yogi | 10–12 | Pre-teen. Prefers information-dense UI, full Sanskrit pose names, no mascot, full engagement metrics (streak + breath count). |

### Secondary User: The Parent / Guardian

The parent completes onboarding, selects the child's age tier, accepts the medical disclaimer, and optionally sets a PIN to protect settings. They do not use the app during the child's session.

---

## User Needs

| User | Need |
|---|---|
| Child (Seedling) | Simple, guided experience; recognizable animal pose names; auto-advance so they don't get stuck |
| Child (Explorer) | Session structure with feedback; breathing variety; streak motivation |
| Child (Yogi) | Full information, Sanskrit terminology, all metrics visible |
| Parent | Confidence that content is safe and appropriate; ability to update age tier as child grows; medical disclaimer on file; optional PIN to prevent unsupervised changes |

---

## Product Principles

1. **Child-first language.** Every pose has a `childFriendlyName` and optional `animalName`. Technical or Sanskrit terminology is gated by age tier.
2. **Safety first.** Contraindication alerts surface per pose. Ailments that carry medical risk display a `SafetyBanner`. A disclaimer must be accepted before the child can access the app.
3. **Age-progressive complexity.** The same underlying content is presented differently for each tier — vocabulary, font size, session length, session control, and visible metrics all scale with tier.
4. **Parent in control, child in flow.** Parents configure once; children experience without friction.
5. **Offline-first.** All content is bundled; no network dependency.

---

## Core Features

### 1. Age Tier System

Three tiers adapt the entire experience: content filtering, vocabulary level, font size, mascot visibility, streak display, auto-advance behavior, timer style, and Sanskrit name visibility. Implemented in `useAgeTheme` and `useAgeContent`.

### 2. Onboarding

A 5-screen setup flow that a parent completes once:
1. **Welcome** — app introduction and parent handoff notice
2. **Age Tier Selection** — choose Seedling / Explorer / Yogi
3. **Child Profile** — enter the child's preferred name and optional character color
4. **Medical Disclaimer** — parent acceptance required before proceeding
5. **PIN Setup** — optional 4-digit PIN to protect parent settings

### 3. Home Screen

The child's daily entry point. Provides:
- Time-of-day greeting with the child's name
- Streak badge (Explorer and Yogi tiers only)
- Mood picker (6 emoji moods → routes to relevant ailment or category)
- Body map (7 body zones → routes to relevant ailment)
- Quick-access tiles (Breathing, Bedtime)
- "Explore All" button

### 4. Ailment Library

16 conditions (8 physical, 8 emotional) organized by category. Each ailment has a color-coded card, emoji, child-friendly name, description, pose list, recommended breathing exercises, and optional safety note. Accessed via CategoryBrowserScreen (tab toggle: Physical / Emotional) → AilmentDetailScreen.

### 5. Yoga Session Player

A full-screen session experience:
- Pose display with tier-appropriate name
- Hold timer (jar style for Seedling, ring style for Explorer/Yogi)
- Pose instructions with age-appropriate truncation
- Step-by-step progress bar
- Prev/pause/next controls (manual for Explorer/Yogi; auto-advance for Seedling)
- Haptic feedback on pose transitions
- Optional audio narration via expo-speech
- Contraindication alerts per pose (shown once per pose per session)
- Session completion → progress recorded → streak updated

### 6. Breathing Exercise Library

9 breathing exercises with kid-friendly names (Balloon Breathing, Bumblebee Breath, Box Breathing, Dragon Breath, Ocean Breathing, Rainbow Breathing, Belly Breathing, Star Breathing, Flower Breathing). Accessed via the Breathe tab. Each exercise has a phase-by-phase cycle player with round tracking.

### 7. Progress Tracking

`useProgressStore` records every completed session with timestamp, duration, steps completed, and optional mood rating. Streak logic counts consecutive practice days. Streak is displayed on the Home screen (Explorer and Yogi tiers) and the Profile screen.

### 8. Parent Gate and PIN

A `PinGate` modal protects the Settings / Profile screen. The gate uses `useParentGate`, which enforces a 3-attempt lockout with a 30-second cooldown. If no PIN was set during onboarding, the gate is skipped.

### 9. Safety System

Three layers of safety:
- **Disclaimer screen** — medical disclaimer accepted once during onboarding; timestamp stored in profile.
- **SafetyBanner** — shown on ailments with `alwaysShowSafetyBanner: true`.
- **ContraindicationAlert** — shown once per pose per session if the pose has `contraindications`.

---

## Functional Requirements

### Onboarding Experience

- FR-O1: App must gate all child-facing content behind completed onboarding (profile not null and `hasAcceptedDisclaimer === true`).
- FR-O2: Tier selection must persist to SecureStore and be readable on next launch.
- FR-O3: Disclaimer acceptance must store a timestamp.
- FR-O4: PIN is optional; if skipped, parent settings screen is accessible without PIN.
- FR-O5: Onboarding draft (in-progress state) must be saved to SecureStore so partial onboarding survives app kills.

### Home Screen

- FR-H1: Mood selection must navigate to the relevant ailment or category.
- FR-H2: Body zone selection must navigate to the relevant ailment.
- FR-H3: Streak badge must only be shown for Explorer and Yogi tiers.
- FR-H4: Yogi mascot must be shown for Seedling (120px) and Explorer (64px); hidden for Yogi tier.
- FR-H5: Background color must reflect the active tier.

### Ailment Experience

- FR-A1: CategoryBrowserScreen must filter ailments by Physical or Emotional tab.
- FR-A2: AilmentDetailScreen must filter poses for the active tier using `filterPosesForTier`.
- FR-A3: Pose names must be rendered using `poseName(pose, tier)` — animal name for Seedling, English + intro-Sanskrit for Explorer, full Sanskrit for Yogi.
- FR-A4: SafetyBanner must be shown when `ailment.alwaysShowSafetyBanner === true`.
- FR-A5: Recommended breathing exercise card must be shown when `ailment.recommendedBreathingIds[0]` exists.

### Session Experience

- FR-S1: `buildSession` must filter poses for the profile's age range and cap hold time at `profile.maxHoldBreaths`.
- FR-S2: Session steps must alternate pose → 3-second transition → pose.
- FR-S3: The session player must keep the screen awake (`expo-keep-awake`).
- FR-S4: Auto-advance must be active only for Seedling tier (`autoAdvanceSession: true`).
- FR-S5: Contraindication alerts must be shown at most once per pose per session.
- FR-S6: Session completion must call `recordCompletion` and navigate to `SessionComplete`.
- FR-S7: Quit confirmation must be shown before ending a session (except on web).

### Breathing Experience

- FR-B1: Breathing player must cycle through all phases in the `exercise.cycle` array.
- FR-B2: Progress bar must reflect phase elapsed time at 50ms resolution.
- FR-B3: Round counter must reach `exercise.defaultCycles` before completing.
- FR-B4: Haptic feedback must fire on round completion and exercise completion.
- FR-B5: Pause/resume must stop and restart phase timers correctly.

### Progress Experience

- FR-P1: Streak must count consecutive calendar days with at least one completed session.
- FR-P2: Streak must reset to 0 if the last practice day is before yesterday.
- FR-P3: Progress store must persist to AsyncStorage (not SecureStore).

### Age Tier Behavior

See the full tier comparison table in [DESIGN.md](DESIGN.md#age-tier-theming) and `src/features/age-adaptive/useAgeTheme.ts`.

---

## User Journeys

### First Launch (Parent)

1. App cold-starts — no profile in SecureStore.
2. RootNavigator shows the Onboarding stack.
3. Parent sees WelcomeScreen ("This section is for parents & guardians").
4. Parent taps "Let's Get Started" → AgeTierScreen.
5. Parent selects age tier → ChildProfileScreen.
6. Parent enters child's preferred name → DisclaimerScreen.
7. Parent reads and accepts medical disclaimer → PinSetupScreen.
8. Parent optionally sets a 4-digit PIN or skips → onboarding complete.
9. Profile saved to SecureStore; `hasAcceptedDisclaimer: true`.
10. RootNavigator switches to Main stack; HomeScreen renders.

### Yoga Session

1. Child is on HomeScreen and taps a mood or body zone.
2. AilmentDetailScreen loads with the matched ailment.
3. Child sees filtered pose list and session duration estimate.
4. Child taps "Start Session".
5. `buildSession` constructs a tier-appropriate session.
6. SessionPlayerScreen appears (slides from bottom, no back gesture).
7. Session auto-starts with a bell (if audio enabled).
8. Child moves through poses; contraindication alert shown once for first pose.
9. Session completes → bell → `recordCompletion` → SessionCompleteScreen.
10. Child sees animated celebration and streak update.

### Breathing Exercise

1. Child taps "Breathing" quick-access tile on HomeScreen or Breathe tab.
2. BreathingLibraryScreen shows 9 exercises in a 3-column grid.
3. Child taps an exercise → BreathingPlayerScreen.
4. Phase guidance (inhale / hold / exhale / holdAfterExhale) cycles automatically.
5. Progress arc and breath counter update in real time.
6. Exercise completes after `defaultCycles` rounds → haptic success.
7. BreathingCompleteScreen shows summary.

### Parent Settings Access

1. Child or parent taps ⚙️ on HomeScreen (or navigates to Me tab).
2. If a PIN was set, PinGate modal appears.
3. Parent enters PIN; 3 wrong attempts trigger a 30-second lockout.
4. On correct PIN (or no PIN set), ProfileScreen is shown.
5. Parent can change age tier; change persists immediately via `updateTier`.

---

## Non-Functional Requirements

- NFR-1: **Offline-only.** No network requests. All content is bundled.
- NFR-2: **Portrait-only.** `orientation: "portrait"` in `app.json`.
- NFR-3: **No tablets.** `supportsTablet: false`.
- NFR-4: **Accessibility.** All interactive elements declare `accessibilityRole` and `accessibilityLabel`. Progress bar uses `accessibilityRole="progressbar"`. Touch targets are minimum 44×44px per `spacing.minTouchTarget`.
- NFR-5: **Profile security.** Profile data (including PIN hash) is stored in SecureStore, not AsyncStorage.
- NFR-6: **No tracking.** No analytics, no crash reporting, no third-party SDKs.

---

## Implementation Status

| Feature | Status |
|---|---|
| Onboarding flow | Implemented |
| Age tier system | Implemented |
| Home screen | Implemented |
| Ailment library (16 ailments) | Implemented |
| Yoga session player | Implemented |
| Breathing library (9 exercises) | Implemented |
| Breathing player | Implemented |
| Progress tracking + streak | Implemented |
| Parent PIN gate | Implemented |
| Safety system (disclaimer, banner, contraindications) | Implemented |
| Lottie pose animations | Stub — `lottieAsset` fields present, animation files not bundled |
| Audio bells | Stub — MP3 references present, files not bundled |
| Full-gradient breathing player | Partial — solid background color only |
| Mood rating UI on session complete | Not yet implemented (store ready) |

---

## Future Enhancements

See [docs/ROADMAP.md](docs/ROADMAP.md) for the complete roadmap.
