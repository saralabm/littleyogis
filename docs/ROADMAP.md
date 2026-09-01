# Roadmap — Little Yogi Wellness

This roadmap is derived exclusively from: incomplete implementations in the codebase, stub references, comments in source files, and patterns observable in the git history. No business requirements or features have been invented.

---

## Current State

All core application screens, navigation, state management, and content data are implemented. The app is functional as a prototype. A developer can run `npm start`, complete onboarding, browse ailments, start yoga sessions, use the breathing player, and review the profile/progress screen.

---

## Known Gaps (Implemented but Incomplete)

These items have code infrastructure in place but are missing assets or final UI.

### Lottie Pose Animations

**Status:** Stub.

Every `Pose` object has a `lottieAsset` field (e.g., `'animations/poses/childs-pose.json'`). The `PoseAnimation` component (`src/components/session/PoseAnimation.tsx`) exists. The `animations/poses/` directory at `src/assets/animations/poses/` exists but is empty — no `.lottie` or `.json` animation files are present.

**What's needed:** Source or create `.lottie` animation files for each pose and place them at the paths referenced in each ailment data file.

### Lottie Breathing Animations

**Status:** Stub.

`BreathingExercise` objects have an optional `lottieAsset` field. The `src/assets/animations/breathing/` directory exists but is empty.

**What's needed:** Breathing animation files, or confirmation that `BreathingCircle` SVG animation is sufficient.

### Yogi Mascot Illustration

**Status:** Emoji placeholder.

`HomeScreen` and `SessionCompleteScreen` render a circular gold `View` with a 🧘 emoji as a placeholder (`styles.yogiPlaceholder`). The design calls for a custom character illustration sized to the tier's `yogiSize`.

**What's needed:** Proper mascot illustration or Lottie asset for the Yogi character.

### Full Gradient Breathing Player

**Status:** Partial.

`BreathingCard` uses only `gradientColors[0]` as a solid background color. As noted in [DESIGN.md](../DESIGN.md): "Full gradient rendering requires a `LinearGradient` implementation on the exercise detail/player screen."

**What's needed:** Add `expo-linear-gradient` (or `react-native-linear-gradient`) and replace the solid background on `BreathingPlayerScreen` and `BreathingCard` with a proper gradient.

### Mood Rating UI on Session Complete

**Status:** Store ready, no UI.

`useProgressStore.updateSessionMoodRating(sessionId, rating)` is implemented and tested. `CompletedSession.moodRating` accepts a numeric rating. No screen currently surfaces a rating prompt after session completion.

**What's needed:** A post-session mood rating UI (e.g., emoji picker on `SessionCompleteScreen`) that calls `updateSessionMoodRating`.

### `updateSessionMoodRating` ID Bug

**Status:** Minor bug in store.

In `useProgressStore.updateSessionMoodRating`, the update matches on `s.id === sessionId`, but `CompletedSession` uses `sessionId` (not `id`) as the field name per the `CompletedSession` interface in `src/types/index.ts`. This would need to be fixed before the mood rating UI can work correctly.

---

## Near-Term

Items that are a natural next step given the current state of the codebase:

- **Mood rating UI** — the store is already wired; just needs a `SessionCompleteScreen` prompt.
- **Lottie pose animation files** — the most visible missing piece for production quality.
- **LinearGradient breathing backgrounds** — low-effort visual polish.
- **EAS Build configuration** — production build pipeline not yet configured; `eas.json` does not exist.
- **Progress screen for the child** — the Me/Profile tab currently shows parent-focused controls. A child-facing view of their session history and streak trend would close the progress loop.

---

## Future Considerations

These are implied by the current architecture but would require new work beyond filling stubs:

- **Multiple child profiles** — the current `AgeProfile` model is single-user. Supporting siblings would require a profile list and switcher.
- **Guided breathing narration** — `BreathingPlayerScreen` does not yet use `expo-speech` for phase narration. `usePoseNarration` exists for yoga sessions; a parallel hook for breathing is not implemented.
- **Session history view** — `completedSessions[]` in the progress store has the full history, but no screen renders it as a list or chart.
- **Custom session builder** — the architecture already separates `buildSession` from the session player; a UI to let parents pick specific poses could use the same player.
- **Accessibility audit** — accessibility roles and labels are implemented throughout, but a formal audit with screen readers (VoiceOver, TalkBack) has not been performed.
- **Tablet layout** — currently disabled (`supportsTablet: false`). The architecture would support it with responsive layout work.
- **Cloud sync / multi-device** — all state is local. Adding a back-end would require an auth model not currently designed for.

---

## Not Planned

The following are explicitly out of scope based on the current codebase:

- Analytics, tracking, or telemetry (no SDK, no endpoints).
- Subscriptions or in-app purchases.
- Social or sharing features.
- Adult yoga content.
