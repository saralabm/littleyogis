# Content Model — Little Yogi Wellness

All wellness content is defined as static TypeScript data bundled with the app. There is no CMS, no remote data fetch, and no dynamic content loading. The source of truth is `src/data/` and `src/types/index.ts`.

---

## Content Categories

The app contains two categories of therapeutic content:

| Category | Type | Count |
|---|---|---|
| Physical ailments | Conditions with a physical presentation | 8 |
| Emotional ailments | Conditions with an emotional/behavioral presentation | 8 |
| Breathing exercises | Guided breath-work practices | 9 |

---

## Ailment Structure

Defined by the `Ailment` interface in `src/types/index.ts`.

```ts
interface Ailment {
  id: string;                         // URL-safe slug, e.g. 'anxiety', 'poor-posture'
  category: 'physical' | 'emotional';
  displayName: string;                // Clinical/adult name, e.g. "Anxiety / Worry"
  childFriendlyName: string;          // Child-facing label, e.g. "Calm & Cozy Yoga"
  emoji: string;                      // Primary emoji for the card
  accentColor: string;                // Hex color for the card background
  shortDescription: string;           // 1–2 sentence description
  recommendedBreathingIds: string[];  // IDs of suggested BreathingExercise objects
  appTip: string;                     // Internal guidance note (not shown to users)
  safetyNote?: string;                // Optional medical safety note
  alwaysShowSafetyBanner?: boolean;   // If true, SafetyBanner renders on AilmentDetailScreen
  poses: Pose[];                      // Ordered list of yoga poses for this ailment
}
```

### Physical Ailments

All files in `src/data/ailments/physical/`.

| ID | File | Display Name | Child-Friendly Name |
|---|---|---|---|
| `constipation` | `constipation.ts` | Constipation | Happy Tummy Yoga |
| `poor-posture` | `poorPosture.ts` | Poor Posture | Stand Tall Yoga |
| `low-energy` | `lowEnergy.ts` | Low Energy / Fatigue | Wake Up & Glow Yoga |
| `headaches` | `headaches.ts` | Headaches & Head Tension | Calm Head Yoga |
| `tight-hamstrings` | `tightHamstrings.ts` | Tight Hamstrings & Stiff Legs | Stretchy Legs Yoga |
| `weight-support` | `obesity.ts` | Weight Management Support | Strong & Happy Yoga |
| `coordination` | `coordination.ts` | Poor Coordination & Balance | Super Balance Yoga |
| `asthma` | `asthma.ts` | Asthma & Breathing Difficulties | Easy Breath Yoga |

### Emotional Ailments

All files in `src/data/ailments/emotional/`.

| ID | File | Display Name | Child-Friendly Name |
|---|---|---|---|
| `anxiety` | `anxiety.ts` | Anxiety / Worry | Calm & Cozy Yoga |
| `anger` | `anger.ts` | Anger & Frustration | Cool Down Yoga |
| `hyperactivity` | `hyperactivity.ts` | Hyperactivity | Slow Down & Focus Yoga |
| `adhd` | `adhd.ts` | ADHD / Attention Challenges | Focus & Flow Yoga |
| `sleep-issues` | `sleepIssues.ts` | Sleep Issues & Restlessness | Sleepy Time Yoga |
| `exam-stress` | `examStress.ts` | Exam Stress & Performance Anxiety | Clear Mind Yoga |
| `emotional-overwhelm` | `emotionalOverwhelm.ts` | Emotional Overwhelm | Big Feelings Yoga |
| `low-confidence` | `lowConfidence.ts` | Low Confidence & Self-Esteem | Brave & Bright Yoga |

---

## Pose Structure

Defined by the `Pose` interface in `src/types/index.ts`. Each `Ailment.poses` array contains 3–6 `Pose` objects.

```ts
interface Pose {
  id: string;                         // URL-safe slug, e.g. 'childs-pose'
  englishName: string;                // Standard English pose name
  sanskritName: string;               // Sanskrit name, e.g. "Balasana"
  animalName?: string;                // Child-friendly alias, e.g. "Sleeping Mouse"
  howItHelps: string;                 // Brief explanation of therapeutic benefit
  ageSuitability: 'both' | '4-6' | '7-9' | '10-12';
  holdTimeBreaths: { min: number; max: number };  // Hold duration in breaths
  contraindications: string[];        // Medical conditions that contraindicate this pose
  modificationNotes?: string;         // Optional accessibility/modification guidance
  lottieAsset: string;                // Path to .lottie animation file (stub — not bundled)
  thumbnailAsset: string;             // Path to thumbnail image (stub — not bundled)
}
```

### Age Suitability Values

| Value | Meaning |
|---|---|
| `'both'` | Suitable for all age tiers |
| `'4-6'` | Seedling tier only |
| `'7-9'` | Explorer tier only |
| `'10-12'` | Yogi tier only |

`useAgeContent.filterPosesForTier` uses these values to build the visible pose list on `AilmentDetailScreen` and the session steps in `buildSession`.

### Pose Name Rendering by Tier

`poseName(pose, tier)` in `src/utils/poseNameUtils.ts` returns:
- **Seedling:** `pose.animalName` if present, otherwise `pose.englishName`
- **Explorer:** `"${pose.englishName} (${pose.sanskritName})"` (intro-Sanskrit format)
- **Yogi:** `"${pose.englishName} — ${pose.sanskritName}"` (full-Sanskrit format)

---

## Breathing Exercise Structure

Defined by the `BreathingExercise` interface in `src/types/index.ts`.

```ts
interface BreathingExercise {
  id: string;                         // URL-safe slug, e.g. 'balloon-breathing'
  kidFriendlyName: string;            // Child-facing name, e.g. "Balloon Belly Breathing"
  traditionalName: string;            // Clinical/adult name, e.g. "Diaphragmatic Breathing"
  ageSuitability: 'both' | '4-6' | '7-9' | '10-12';
  defaultCycles: number;              // Number of rounds before exercise completes
  cycle: BreathCycle[];               // Ordered array of breath phases
  whatItHelps: string[];              // List of conditions this exercise helps
  instructions: string[];             // Step-by-step text instructions
  emoji: string;                      // Primary emoji for the card
  lottieAsset?: string;               // Optional animation asset path
  audioAsset?: string;                // Optional audio guidance asset path
  gradientColors: [string, string];   // [startHex, endHex] for card and player background
}
```

### Breath Cycle Structure

```ts
interface BreathCycle {
  phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';
  durationSeconds: number;
  label: string;                      // User-visible label, e.g. "Breathe In"
  animationState: string;             // Animation hint, e.g. "expand" | "contract" | "hold"
}
```

### Breathing Exercises

All files in `src/data/breathing/`.

| ID | File | Kid-Friendly Name | Traditional Name | Cycles | Emoji |
|---|---|---|---|---|---|
| `balloon-breathing` | `balloonBreathing.ts` | Balloon Belly Breathing | Diaphragmatic Breathing | 7 | 🎈 |
| `bumblebee-breath` | `bumblebeeBreath.ts` | Bumblebee Breath | Bhramari Pranayama | — | 🐝 |
| `box-breathing` | `boxBreathing.ts` | Box Breathing | Sama Vritti Pranayama | — | 📦 |
| `dragon-breath` | `dragonBreath.ts` | Dragon Breath | Kapalabhati (adapted) | — | 🐉 |
| `ocean-breathing` | `oceanBreathing.ts` | Ocean Breathing | Ujjayi Pranayama | — | 🌊 |
| `rainbow-breathing` | `rainbowBreathing.ts` | Rainbow Breathing | Movement + Breath | — | 🌈 |
| `belly-breathing` | `bellyBreathing.ts` | Belly Breathing | Abdominal Breathing | — | 🌱 |
| `star-breathing` | `starBreathing.ts` | Star Breathing | 5-Point Breathing | — | ⭐ |
| `flower-breathing` | `flowerBreathing.ts` | Flower Breathing | Visualization Breath | — | 🌸 |

_Note: `defaultCycles` for all exercises except `balloon-breathing` is not determinable without reading each file individually. `balloon-breathing` has `defaultCycles: 7`._

### Gradient Colors per Exercise

Used as the card background (first color only — see note below) and intended as the full gradient on the player screen.

| ID | Gradient Start | Gradient End |
|---|---|---|
| `balloon-breathing` | `#81C784` | `#A5D6A7` |
| `bumblebee-breath` | `#FFB300` | `#FFD54F` |
| `box-breathing` | `#7986CB` | `#9FA8DA` |
| `dragon-breath` | `#EF5350` | `#FF7043` |
| `ocean-breathing` | `#0288D1` | `#4FC3F7` |
| `rainbow-breathing` | `#E91E63` | `#FF9800` |
| `belly-breathing` | `#66BB6A` | `#A5D6A7` |
| `star-breathing` | `#F9A825` | `#FFD54F` |
| `flower-breathing` | `#EC407A` | `#F48FB1` |

> **Note (from DESIGN.md):** `BreathingCard` currently uses only `gradientColors[0]` as a solid `backgroundColor`. Full gradient rendering requires a `LinearGradient` implementation on the player screen — this is a known gap.

---

## Data Barrel (`src/data/index.ts`)

The barrel file re-exports all content and provides two lookup helpers:

```ts
export const ailments: Ailment[] = [...all 16 ailments...]
export const breathingExercises: BreathingExercise[] = [...all 9 exercises...]

export function getAilmentById(id: string): Ailment | undefined
export function getBreathingById(id: string): BreathingExercise | undefined
```

Both lookups are linear scans of the static arrays. For a dataset of this size (16 and 9 items), this is adequate.

---

## How Content Is Consumed by Screens

| Consumer | Content used | Via |
|---|---|---|
| `CategoryBrowserScreen` | `ailments` filtered by `category` | `src/data/index.ts` → `ailments` array |
| `AilmentDetailScreen` | Single `Ailment` + its `poses` (filtered) + one `BreathingExercise` | `getAilmentById`, `getBreathingById`, `filterPosesForTier` |
| `buildSession` | Single `Ailment.poses` filtered by `profile.ageRange` | Imported directly |
| `SessionPlayerScreen` | `Ailment.poses` for narration and contraindications | `getAilmentById` |
| `BreathingLibraryScreen` | All `breathingExercises` | `src/data/index.ts` |
| `BreathingPlayerScreen` | Single `BreathingExercise` | `getBreathingById` |
| `HomeScreen` | Hard-coded ailment IDs for mood/body-map tiles | Inline in screen |

---

## Content Structural Tests

`__tests__/data/ailments.test.ts` verifies structural integrity of all ailment data: required fields present, valid category values, non-empty pose arrays, valid `ageSuitability` values, and `gradientColors` format on breathing exercises. These tests run with every `npx jest` invocation.
