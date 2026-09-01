# Little Yogi Wellness

A children's yoga and wellness app for ages 4–12, built with Expo and React Native. The app guides children through age-appropriate yoga sessions, breathing exercises, and wellness check-ins, with a parent-controlled safety gate and age-tier content adaptation.

> The Expo project name is **Healing Stars** (`app.json` slug: `healing-stars`). The codebase folder and design system are named **LittleYogi Wellness**.

---

## Overview

Little Yogi Wellness helps children manage physical discomfort and emotional wellbeing through guided yoga and breathing practices. A parent or guardian completes a brief onboarding to select the child's age tier; from that point forward, the app's language, session length, visual complexity, and content are automatically adapted to the child's developmental stage.

**Target users:** Children ages 4–12 as primary users; parents and guardians as setup users.

---

## Current Capabilities

| Area | Status |
|---|---|
| Onboarding (5 screens) | Implemented |
| Age tier selection (Seedling / Explorer / Yogi) | Implemented |
| Child profile setup | Implemented |
| Parent disclaimer acceptance | Implemented |
| Optional PIN protection for parent settings | Implemented |
| Home screen — mood picker + body map | Implemented |
| Ailment library — 8 physical + 8 emotional conditions | Implemented |
| Yoga session player with timer, controls, narration | Implemented |
| Session completion screen with streak tracking | Implemented |
| Breathing exercise library — 9 exercises | Implemented |
| Breathing player (phase-by-phase guidance) | Implemented |
| Breathing completion screen | Implemented |
| Profile / Me tab with tier selector | Implemented |
| Age-adaptive theming (colors, font sizes, mascot) | Implemented |
| Age-adaptive content filtering (pose suitability) | Implemented |
| Progress tracking and streak calculation | Implemented |
| Contraindication alerts per pose | Implemented |
| Haptic feedback during sessions | Implemented |
| Pose narration via expo-speech | Implemented |
| Lottie pose animations | Stub (assets not bundled) |
| Audio bells (session start/end) | Stub (MP3 files not bundled) |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) ~56.0.8 |
| UI runtime | React Native 0.85.3 |
| React | 19.2.3 |
| Language | TypeScript ~6.0.3 |
| State management | [Zustand](https://github.com/pmndrs/zustand) ^4.5.7 |
| Persistent profile store | expo-secure-store (encrypted) |
| Persistent progress store | @react-native-async-storage/async-storage |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) |
| Graphics | react-native-svg 15.15.4 |
| Animations | lottie-react-native ^7.3.8 |
| Audio | expo-av ^16.0.8 |
| Speech | expo-speech ~56.0.3 |
| Haptics | expo-haptics ~56.0.3 |
| Fonts | @expo-google-fonts/nunito, nunito-sans, dm-mono |
| Testing | Jest 29 + jest-expo + @testing-library/react-native |

---

## Architecture Overview

```
App.tsx
└── RootNavigator
    ├── Onboarding Stack (if profile not set or disclaimer not accepted)
    │   └── Welcome → AgeTier → ChildProfile → Disclaimer → PinSetup
    └── Main App Stack (after onboarding complete)
        ├── MainTabNavigator
        │   ├── Home tab       → HomeScreen
        │   ├── Explore tab    → CategoryBrowser → AilmentDetail
        │   ├── Breathe tab    → BreathingLibrary → BreathingPlayer → BreathingComplete
        │   └── Me tab         → ProfileScreen
        ├── SessionPlayer (modal, slides from bottom)
        └── SessionComplete (modal, fade)
```

State is managed by three Zustand stores:
- **useProfileStore** — persisted to SecureStore (age tier, name, PIN, disclaimer)
- **useProgressStore** — persisted to AsyncStorage (completed sessions, streak)
- **useSessionStore** — in-memory (active session state)

Age-adaptive behavior is driven by `useAgeTheme` and `useAgeContent` feature hooks that read the active tier from `useProfileStore`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full technical breakdown.

---

## Repository Structure

```
LittleYogiWellness/
├── App.tsx                     Entry point — loads fonts, renders RootNavigator
├── index.ts                    Expo entry point
├── app.json                    Expo app configuration
├── package.json
├── babel.config.js             Path aliases (@components, @data, etc.)
├── jest.config.js
├── tsconfig.json
├── DESIGN.md                   Design system (colors, typography, spacing, components)
├── README.md                   This file
├── PRD.md                      Product requirements document
├── ARCHITECTURE.md             Technical architecture
├── DEVELOPMENT.md              Developer onboarding guide
├── CHANGELOG.md                Development history
├── assets/                     App icon, splash, adaptive icon
├── docs/                       Detailed documentation
│   ├── PRODUCT_OVERVIEW.md
│   ├── USER_FLOWS.md
│   ├── FEATURE_SPECIFICATIONS.md
│   ├── CONTENT_MODEL.md
│   ├── DATA_MODEL.md
│   └── ROADMAP.md
└── src/
    ├── components/             atoms/, molecules/, breathing/, session/
    ├── data/                   ailments/ (physical + emotional), breathing/
    ├── features/               age-adaptive/, parent/
    ├── hooks/                  useSessionPlayer, useBreathingPlayer, etc.
    ├── navigation/             RootNavigator, MainTabNavigator, navigationTypes
    ├── screens/                onboarding/, home/, explore/, session/, breathing/, profile/
    ├── store/                  useProfileStore, useProgressStore, useSessionStore
    ├── theme/                  colors, typography, spacing
    ├── types/                  index.ts (all shared TypeScript interfaces)
    └── utils/                  ageUtils, buildSession, poseNameUtils, timeUtils, accessibility
```

---

## Prerequisites

- Node.js (LTS recommended — exact version not pinned in `.nvmrc`)
- npm (bundled with Node)
- Expo Go app on iOS or Android device, or an iOS Simulator / Android Emulator

Install the Expo CLI globally if you don't have it:

```bash
npm install -g expo-cli
```

---

## Installation

```bash
git clone <repository-url>
cd LittleYogiWellness
npm install
```

---

## Starting the Development Environment

```bash
# Start the Expo dev server (choose device from terminal menu)
npm start

# Start and open on Android
npm run android

# Start and open on iOS
npm run ios

# Start and open in browser
npm run web
```

---

## Running Tests

```bash
npx jest
```

Tests live in `__tests__/` and cover:
- Data integrity (ailment and breathing exercise structure)
- Utility functions (ageUtils, buildSession, poseNameUtils, timeUtils)
- Stores (useProfileStore, useProgressStore, useSessionStore)
- Hooks (useSessionPlayer, useBreathingPlayer)
- Features (useAgeTheme, useParentGate)
- Utilities (accessibility)

---

## Useful Commands

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS |
| `npm run web` | Open in browser |
| `npx jest` | Run all tests |
| `npx jest --watch` | Run tests in watch mode |
| `npx tsc --noEmit` | Type-check without building |

---

## Development Status

The app is **feature-complete at the prototype/MVP level**. All core screens, navigation, state management, content data, and age-adaptive logic are implemented. The following items are stubs awaiting production assets:

- **Lottie animations** — `lottieAsset` fields are populated in pose data but `.lottie` files are not bundled. `PoseAnimation.tsx` renders a placeholder.
- **Audio bells** — `bell_start.mp3` and `bell_end.mp3` are referenced in `useSessionPlayer.ts` and `SessionPlayerScreen.tsx` but the MP3 files are not included. The code handles this gracefully with a no-op stub.
- **Full gradient rendering** — `BreathingCard` uses only `gradientColors[0]` as a solid background. The `LinearGradient` implementation is noted as a TODO in [DESIGN.md](DESIGN.md).
- **Mood rating UI** — `updateSessionMoodRating` is implemented in `useProgressStore` but no screen currently calls it.

---

## Known Limitations

- No back-end or cloud sync — all data is stored locally on the device.
- No tablet layout — `supportsTablet: false` in `app.json`.
- Portrait-only orientation.
- The `WelcomeScreen` displays the app name as "Healing Stars" (the `app.json` name); the design system and repo use "Little Yogi Wellness."

---

## Further Reading

- [PRD.md](PRD.md) — Product requirements and user journeys
- [ARCHITECTURE.md](ARCHITECTURE.md) — Technical architecture
- [DEVELOPMENT.md](DEVELOPMENT.md) — Developer onboarding
- [DESIGN.md](DESIGN.md) — Design system (colors, typography, components)
- [docs/PRODUCT_OVERVIEW.md](docs/PRODUCT_OVERVIEW.md) — Product vision and value proposition
- [docs/USER_FLOWS.md](docs/USER_FLOWS.md) — User flows
- [docs/FEATURE_SPECIFICATIONS.md](docs/FEATURE_SPECIFICATIONS.md) — Feature specifications
- [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md) — Content data model
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md) — Application data and state model
- [docs/ROADMAP.md](docs/ROADMAP.md) — Roadmap
