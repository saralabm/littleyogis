# Development Guide — Little Yogi Wellness

---

## Prerequisites

- **Node.js** — LTS version recommended. The project does not pin a Node version (no `.nvmrc`). Expo 56 officially supports Node 18+.
- **npm** — bundled with Node. The project uses `package-lock.json` (npm workspaces not used).
- **Expo Go** — install on your iOS or Android test device from the respective app store, or use a simulator/emulator.
- **Expo CLI** (optional global) — the `expo` binary is available as a project-local `devDependency` via `npx`. You can also install globally: `npm install -g expo-cli`.

---

## Installation

```bash
git clone <repository-url>
cd LittleYogiWellness
npm install
```

This installs all dependencies including Expo 56, React Native 0.85, and all native module packages.

---

## Starting the Development Server

```bash
npm start
```

This runs `expo start`. A QR code is printed in the terminal. Scan it with the Expo Go app on your device, or press:
- `a` — open on connected Android emulator
- `i` — open on connected iOS simulator
- `w` — open in browser

Platform-specific shortcuts:

```bash
npm run android   # expo start --android
npm run ios       # expo start --ios
npm run web       # expo start --web
```

---

## Running on a Device

1. Ensure your device and development machine are on the same Wi-Fi network.
2. Run `npm start`.
3. Scan the QR code with the Expo Go app (Android) or the Camera app (iOS).

For the iOS simulator, press `i` in the terminal after running `npm start`. Xcode must be installed.

For the Android emulator, start an AVD from Android Studio first, then press `a`.

---

## Running Tests

```bash
npx jest
```

Run in watch mode during active development:

```bash
npx jest --watch
```

Run a specific test file:

```bash
npx jest __tests__/utils/buildSession.test.ts
```

Tests use the `jest-expo` preset (configured in `jest.config.js`). Path aliases (`@components`, `@data`, etc.) are mapped in `jest.config.js` `moduleNameMapper` to match the Babel aliases used in source code.

---

## Type Checking

```bash
npx tsc --noEmit
```

TypeScript configuration is in `tsconfig.json`. The project uses TypeScript ~6.0.3.

---

## Path Aliases

The following import aliases are configured in `babel.config.js` and `jest.config.js`:

| Alias | Resolves to |
|---|---|
| `@components` | `./src/components` |
| `@screens` | `./src/screens` |
| `@data` | `./src/data` |
| `@store` | `./src/store` |
| `@hooks` | `./src/hooks` |
| `@utils` | `./src/utils` |
| `@theme` | `./src/theme` |
| `@assets` | `./src/assets` |
| `@navigation` | `./src/navigation` |

Use these in imports to avoid fragile relative path chains:

```ts
// Prefer this:
import { useProfileStore } from '@store/useProfileStore';

// Over this:
import { useProfileStore } from '../../../store/useProfileStore';
```

---

## Project Development Workflow

### Adding a New Ailment

1. Create a new file in `src/data/ailments/physical/` or `src/data/ailments/emotional/`.
2. Implement the `Ailment` interface from `src/types/index.ts` (see an existing ailment for reference — `anxiety.ts` and `constipation.ts` are the most complete examples).
3. Ensure each `Pose` in the `poses` array has a valid `ageSuitability` value and realistic `holdTimeBreaths`.
4. Add the import and include it in the `ailments` array in `src/data/index.ts`.
5. The structural integrity tests in `__tests__/data/ailments.test.ts` will catch missing required fields.

### Adding a New Breathing Exercise

1. Create a new file in `src/data/breathing/`.
2. Implement the `BreathingExercise` interface.
3. Define the `cycle` array with `BreathCycle` phases (inhale/hold/exhale/holdAfterExhale).
4. Add a `gradientColors: [startHex, endHex]` pair for the card and player background.
5. Import and add to the `breathingExercises` array in `src/data/index.ts`.

### Modifying Age-Tier Behavior

- Visual/layout behavior: `src/features/age-adaptive/useAgeTheme.ts` — edit `THEME_MAP`.
- Content filtering: `src/features/age-adaptive/useAgeContent.ts` — edit `TIER_SUITABILITY` or `MAX_SESSION_MINUTES`.
- Tier vocabulary/hold caps: `src/store/useProfileStore.ts` — edit `TIER_CONFIG`.

---

## Important Configuration Files

| File | Purpose |
|---|---|
| `app.json` | Expo app name ("Healing Stars"), bundle identifiers, splash, icon, permissions |
| `package.json` | Dependencies and npm scripts |
| `babel.config.js` | Babel preset (expo) + path alias plugin |
| `jest.config.js` | Jest preset (jest-expo), module name mapper for path aliases |
| `tsconfig.json` | TypeScript compiler options |

---

## Audio and Animation Stubs

### Audio

`SessionPlayerScreen.tsx` and `useSessionPlayer.ts` reference:
- `src/assets/audio/bell_start.mp3`
- `src/assets/audio/bell_end.mp3`

These files are not included in the repository. The code handles their absence gracefully — `useSessionPlayer` catches the audio load error and returns a no-op stub. To enable audio, add the MP3 files at those paths.

### Lottie Animations

Every `Pose` has a `lottieAsset` field referencing a `.lottie` file path. The `PoseAnimation` component (`src/components/session/PoseAnimation.tsx`) is implemented but renders a placeholder when the asset file is not present. To add animations, provide `.lottie` files at the referenced paths.

---

## What Should NOT Be Committed

The following are already excluded by `.gitignore` (verify your local `.gitignore` if needed):

- `node_modules/`
- `.expo/`
- `dist/`
- `*.jks`, `*.p8`, `*.p12`, `*.key`, `*.mobileprovision` — signing credentials
- `.env`, `.env.local` — environment variables (none are currently used by this project)
- `android/`, `ios/` — native build directories generated by `expo prebuild`

---

## Build and Deployment Basics

This project has not been configured for EAS Build or production deployment yet. The following are general notes for when that step is taken:

- **Expo Application Services (EAS)** is the recommended build system for Expo 56+ projects.
- Install EAS CLI: `npm install -g eas-cli`
- Configure builds: `eas build:configure`
- Bundle identifiers are already set in `app.json`:
  - iOS: `com.healingstars.wellness`
  - Android: `com.healingstars.wellness`
- Microphone permission is explicitly disabled in `app.json` plugins: `["expo-av", { "microphonePermission": false }]`
- Android permissions array is empty (no location, camera, or contacts required).

---

## Troubleshooting

**`npm install` fails with native module errors:**
Ensure you are on a supported Node version (18+). Delete `node_modules/` and `package-lock.json` and retry.

**Metro bundler shows module resolution errors for `@components/...` paths:**
This is a Babel alias issue. Ensure `babel.config.js` is present and `babel-plugin-module-resolver` is installed. Run `npm install` to restore.

**Tests fail with "Cannot find module '@store/...'":**
The `moduleNameMapper` in `jest.config.js` handles this. If tests fail, verify the `jest.config.js` mapper entries match the `babel.config.js` aliases exactly.

**iOS simulator won't open:**
Ensure Xcode is installed and the Command Line Tools are configured (`xcode-select --install`).

**Expo Go shows a "Something went wrong" error:**
Check the Metro terminal for the actual error. Common causes: a TypeScript type error that TypeScript would catch, or a missing import.
