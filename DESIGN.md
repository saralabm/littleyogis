# Design System — LittleYogi Wellness

This document captures the visual system as it exists in the codebase. All values are sourced directly from `src/theme/` and the component files. Future agents should use these tokens and patterns to make consistent design decisions.

---

## Color Palette

All tokens live in `src/theme/colors.ts` and are exported as a deeply `const`-typed object.

### Primary
| Token | Hex | Usage |
|---|---|---|
| `colors.primary.sunshine` | `#F9A825` | CTA buttons, streak badge text, progress bar default fill, border on secondary button, Explore All button |
| `colors.primary.meadow` | `#66BB6A` | Belly-breathing gradient start; available for green CTAs |

### Secondary
| Token | Hex | Usage |
|---|---|---|
| `colors.secondary.sky` | `#42A5F5` | Available for informational UI |
| `colors.secondary.lavender` | `#9575CD` | Available for calm/relaxation UI |
| `colors.secondary.coral` | `#EF6C00` | Available for energy/warmth UI |
| `colors.secondary.rose` | `#EC407A` | Available for emotional/playful UI |

### Accent
| Token | Hex | Usage |
|---|---|---|
| `colors.accent.mint` | `#80CBC4` | Available for soft teal highlights |
| `colors.accent.peach` | `#FFAB76` | Available for warm pastel highlights |
| `colors.accent.lemon` | `#FFF176` | Available for bright playful highlights |

### Backgrounds
| Token | Hex | Usage |
|---|---|---|
| `colors.bg.primary` | `#FFFBF2` | Default app background (warm off-white); hard-coded on HomeScreen `container` style |
| `colors.bg.card` | `#FFFFFF` | Card surface, body-map list, quick-access tiles |
| `colors.bg.dark` | `#1A1A2E` | Dark-mode/session screens |

### Text
| Token | Hex | Usage |
|---|---|---|
| `colors.text.primary` | `#1C1C2E` | Headings, body-map labels, greeting, section titles, button text on primary variant |
| `colors.text.body` | `#3D3D56` | Standard body copy |
| `colors.text.muted` | `#7B7B99` | Mood labels, body-map chevrons |
| `colors.text.onDark` | `#F0F0FF` | Text rendered on dark backgrounds |

### Tier Backgrounds & Accents
| Tier | Background | Accent |
|---|---|---|
| `seedling` | `#FFF8E1` | `#FFB300` |
| `explorer` | `#F1F8E9` | `#558B2F` |
| `yogi` | `#E8EAF6` | `#3949AB` |

### Breathing Exercise Gradients
Each exercise key maps to a `[start, end]` gradient pair used as the card/screen background.

| Exercise Key | Start | End |
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

In `BreathingCard`, only `gradientColors[0]` (the start color) is used as a solid `backgroundColor`. Full gradient rendering requires a `LinearGradient` implementation on the exercise detail/player screen.

---

## Typography

All tokens live in `src/theme/typography.ts`. The scale is exported as `Record<string, TextStyle>`.

### Font Families
| Variable | Font Name | Purpose |
|---|---|---|
| `NUNITO_BOLD` | `Nunito-Bold` | All display, heading, and large label styles |
| `NUNITO_REGULAR` | `Nunito-Regular` | Not used in a named scale entry (available) |
| `NUNITO_SANS_REGULAR` | `NunitoSans-Regular` | Body copy (medium, small) |
| `NUNITO_SANS_BOLD` | `NunitoSans-Bold` | Large bold body copy (`bodyLg`) |
| `DM_MONO` | `DMMono-Regular` | Countdown timers and breath counters |

### Type Scale
| Token | Family | Size | Line Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `displayXl` | Nunito-Bold | 48px | 52px | 700 | 0.96 | Hero numbers, celebration screens |
| `displayLg` | Nunito-Bold | 36px | 42px | 700 | 0.72 | Large display headings |
| `heading1` | Nunito-Bold | 28px | 36px | 700 | 0.56 | Screen-level H1 |
| `heading2` | Nunito-Bold | 22px | 30px | 700 | 0.44 | Section headings |
| `heading3` | Nunito-Bold | 18px | 26px | 700 | 0.36 | Sub-section headings |
| `bodyLg` | NunitoSans-Bold | 18px | 28px | 700 | 0.36 | Prominent body copy, labels |
| `bodyMd` | NunitoSans-Regular | 16px | 24px | 400 | 0.32 | Standard body copy |
| `bodySm` | NunitoSans-Regular | 14px | 20px | 400 | 0.28 | Secondary labels, captions |
| `timer` | DMMono-Regular | 64px | 64px | 400 | — | Breathing/pose session countdown |
| `breathCount` | DMMono-Regular | 36px | 36px | 400 | — | Breath repetition counter |

Note: `HomeScreen` applies inline `fontSize` overrides to section titles and mood labels using values derived from `useAgeTheme().bodyFontSize`. This overrides the static scale for age-tier adaptivity — see Age Tier Theming below.

---

## Spacing & Layout

All tokens live in `src/theme/spacing.ts`.

### Spacing Scale
| Token | Value | Usage |
|---|---|---|
| `spacing.xs` | 8px | Fine-grained gaps, small padding |
| `spacing.sm` | 16px | Card padding, list item padding |
| `spacing.md` | 24px | Section vertical gaps |
| `spacing.lg` | 32px | Large section separation |
| `spacing.xl` | 48px | Page-level top/bottom padding |
| `spacing.xxl` | 64px | Maximum padding / display breathing room |

### Layout Tokens
| Token | Value | Usage |
|---|---|---|
| `spacing.screenPaddingH` | 20px | Horizontal padding applied to all full-width containers (confirmed in HomeScreen `paddingHorizontal: 20`) |
| `spacing.cardPadding` | 16px | Internal padding for cards; used in `AilmentCard` |

### Border Radius
| Token | Value | Usage |
|---|---|---|
| `spacing.cardRadius` | 20px | Cards: `Card`, `AilmentCard`, `BreathingCard`, body-map container |
| `spacing.buttonRadius` | 100px | Pill-shaped buttons: `Button`, streak badge, Explore All button, progress bar track and fill |
| `spacing.tagRadius` | 8px | Tag/chip components |
| `spacing.inputRadius` | 12px | Text input fields |

### Touch & Control Sizing
| Token | Value | Usage |
|---|---|---|
| `spacing.minTouchTarget` | 44px | Minimum interactive area; settings button is exactly 44×44px |
| `spacing.poseControlSize` | 56px | Pose player prev/next control buttons |
| `spacing.moodEmojiSize` | 60px | Mood picker emoji buttons |

### Grid Math (from component code)
- **AilmentCard** column width: `(screenWidth - 56) / 2` — 2-column grid with 16px outer margins and 16px gap (56 = 20 + 16 + 20).
- **BreathingCard** column width: `(screenWidth - 48) / 3` — 3-column grid with 16px outer margins and 8px gap (48 = 16 + 8 + 8 + 16).

---

## Components

### `Button` (`src/components/atoms/Button.tsx`)

A pill-shaped touchable button with two visual variants.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Button text; also used as `accessibilityLabel` |
| `onPress` | `() => void` | Yes | Press handler |
| `variant` | `'primary' \| 'secondary'` | Yes | Visual style |
| `disabled` | `boolean` | No | Reduces opacity to 0.4 and disables interaction |
| `fullWidth` | `boolean` | No | Sets `width: '100%'` |
| `style` | `ViewStyle` | No | Override styles appended after base styles |

**Variants**
- **primary**: `backgroundColor: #F9A825`, gold drop shadow (`shadowColor: #F9A825`, `shadowOffset: {0, 4}`, `shadowOpacity: 0.4`, `shadowRadius: 8`, `elevation: 4`), text color `#1C1C2E`.
- **secondary**: Transparent background, `borderWidth: 2`, `borderColor: #F9A825`, text color `#F9A825`. Slightly shorter minimum height (52px vs 56px).

**Base styles**: `minHeight: 56px`, `borderRadius: 100`, `paddingHorizontal: 32px`. Text is `fontSize: 18`, `fontWeight: 700`.

**Interaction**: `activeOpacity: 0.85`.

---

### `Card` (`src/components/atoms/Card.tsx`)

A surface container that renders either as a static `View` or a pressable `TouchableOpacity` when `onPress` is provided.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | Yes | Card content |
| `style` | `ViewStyle` | No | Appended to base card style |
| `onPress` | `() => void` | No | If provided, wraps children in a `TouchableOpacity` |
| `accessibilityLabel` | `string` | No | Used when `onPress` is provided |

**Base styles**: `backgroundColor: #FFFFFF`, `borderRadius: 20`, subtle shadow (`shadowColor: #000`, `shadowOffset: {0, 2}`, `shadowOpacity: 0.08`, `shadowRadius: 8`, `elevation: 4`). No padding built in — caller provides padding via `style`.

---

### `ProgressBar` (`src/components/atoms/ProgressBar.tsx`)

An animated horizontal progress bar with a pill track and filled indicator.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `fill` | `number` | Yes | Progress value from 0 to 1 |
| `style` | `ViewStyle` | No | Override styles on the outer track |
| `color` | `string` | No | Fill color; defaults to `#F9A825` |

**Behavior**: Animates fill width changes over 400ms using `Animated.timing` (non-native driver, required for percentage-based width interpolation).

**Track**: `height: 8px`, `borderRadius: 100`, `backgroundColor: rgba(255,255,255,0.30)` — designed to sit on colored/gradient backgrounds where the semi-transparent track reads against the surface.

**Accessibility**: `accessibilityRole="progressbar"` with `accessibilityValue: { min: 0, max: 1, now: fill }`.

---

### `AilmentCard` (`src/components/molecules/AilmentCard.tsx`)

A 2-column grid card for browsing health ailments. Background color is driven by the ailment's data-layer `accentColor` field, making each card visually distinct.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `ailment` | `Ailment` | Yes | Ailment data object (must include `accentColor`, `emoji`, `childFriendlyName`, `category`) |
| `onPress` | `() => void` | Yes | Navigation handler |

**Layout**: Fixed height 160px, dynamic width `(screenWidth - 56) / 2`. Emoji is absolutely positioned `top: 12, right: 12` at `fontSize: 36`. Name is pinned to the bottom (`justifyContent: 'flex-end'`) at `fontSize: 16`, `fontWeight: 700`, `color: #FFFFFF`. Accessibility label reads both name and category.

**Shadow**: `shadowColor: #000`, `shadowOffset: {0, 4}`, `shadowOpacity: 0.1`, `shadowRadius: 8`, `elevation: 4`.

---

### `BreathingCard` (`src/components/molecules/BreathingCard.tsx`)

A 3-column grid card for the breathing library. Background is the first color of the exercise's gradient pair.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `exercise` | `BreathingExercise` | Yes | Exercise data object (must include `gradientColors`, `emoji`, `kidFriendlyName`) |
| `onPress` | `() => void` | Yes | Navigation handler |

**Layout**: Fixed height 120px, dynamic width `(screenWidth - 48) / 3`. Content is centered both axes with `gap: 6`. Emoji at `fontSize: 28`, name at `fontSize: 12`, `fontWeight: 700`, `color: #FFFFFF`, `textAlign: center`, limited to 2 lines.

**Shadow**: Lighter than AilmentCard — `shadowOpacity: 0.08`, `shadowRadius: 4`, `elevation: 2`.

---

## Patterns

### Screen Structure (HomeScreen reference)

HomeScreen establishes the canonical layout pattern:
1. **Container**: `flex: 1`, background driven by `useAgeTheme().backgroundColor` (overrides the default `#FFFBF2` for tier-specific color).
2. **ScrollView** with `paddingBottom: 32` on `contentContainerStyle`; no horizontal padding on the scroll container itself.
3. **Header row**: `paddingHorizontal: 20`, `paddingTop: 16`, `paddingBottom: 8`. Left side is `flex: 1` row with greeting and streak badge; right side is a 44×44 icon button with 8px `hitSlop`.
4. **Section titles**: `fontSize: 18` (overridden by age theme), `fontWeight: 700`, `color: #1C1C2E`, `paddingHorizontal: 20`, `marginBottom: 12`, `marginTop: 8`.
5. **Dividers**: `height: 1`, `backgroundColor: #E0E0E0`, `marginHorizontal: 20`, `marginVertical: 16`.
6. **List blocks** (body map): White card container `marginHorizontal: 20`, `borderRadius: 16`, light shadow; rows have `paddingHorizontal: 16`, `paddingVertical: 14`, `borderBottomWidth: 1`, `borderBottomColor: #F0F0F0`, `minHeight: 60`.

### Card Shadow Tiers

Two distinct shadow levels are used:
- **Subtle** (content cards, tiles): `shadowOffset: {0, 2}`, `shadowOpacity: 0.06–0.08`, `shadowRadius: 4–8`, `elevation: 2–4`.
- **Lifted** (ailment cards, primary buttons): `shadowOffset: {0, 4}`, `shadowOpacity: 0.1–0.4`, `shadowRadius: 8`, `elevation: 4`. The primary button uses a colored shadow (`shadowColor: #F9A825`) for a glow effect.

### Emoji as Visual Language

Emoji serve as the primary iconography throughout the app, replacing custom icon sets. They appear at consistent size tiers:
- 36px — AilmentCard corner emoji
- 28–32px — Breathing card emoji, mood picker emoji, body-map row icons
- 24px — Quick-access tile icons, body-map icons
- 22px — Settings icon

### Interactive States

- All touchable elements use `activeOpacity: 0.85` for a consistent 15% dim on press.
- Disabled state: `opacity: 0.4` (Button component).
- Selected mood button: `opacity: 0.7` (subtle selection indicator).
- All interactive elements declare `accessibilityRole="button"` and a descriptive `accessibilityLabel`.

### Streak Badge Pattern

`backgroundColor: #FFF3E0`, `borderRadius: 100`, `paddingHorizontal: 10`, `paddingVertical: 4`. Text is `fontSize: 14`, `fontWeight: 700`, `color: #F9A825`. Conditionally rendered only for Explorer and Yogi tiers (`showStreak: true`).

---

## Age Tier Theming

Tier-adaptive behavior is driven by `useAgeTheme()` in `src/features/age-adaptive/useAgeTheme.ts`. The hook reads from `useProfileStore().profile.tier` and returns an `AgeTheme` object. Falls back to `'explorer'` if no profile exists.

### Tier Comparison

| Property | Seedling (ages ~3–5) | Explorer (ages ~6–9) | Yogi (ages ~10+) |
|---|---|---|---|
| `backgroundColor` | `#FFF8E1` (warm amber tint) | `#F1F8E9` (fresh green tint) | `#E8EAF6` (cool indigo tint) |
| `accentColor` | `#FFB300` | `#558B2F` | `#3949AB` |
| `bodyFontSize` | 22px | 18px | 16px |
| `instructionFontSize` | 24px | 18px | 16px |
| `showYogi` | true | true | false |
| `yogiSize` | 120px | 64px | 0px (hidden) |
| `showStreak` | false | true | true |
| `showSanskrit` | false | false | true |
| `autoAdvanceSession` | true | false | false |
| `timerStyle` | `'jar'` | `'ring'` | `'ring'` |
| `showBreathCount` | false | true | true |

### Visual Implications by Tier

**Seedling**: Warmest, most playful. Large fonts (22–24px body), large Yogi mascot (120px), no streak pressure, auto-advances through sessions, uses a jar-style fill timer — all designed to reduce cognitive load for young children.

**Explorer**: Balanced middle tier. Standard font sizes (18px), smaller Yogi mascot (64px), streak tracking introduced, manual session advancement, ring-style progress timer, breath count shown. Serves the widest audience.

**Yogi**: Most information-dense. Smallest fonts (16px), no mascot, Sanskrit pose names visible, full engagement metrics (streak + breath count). Ring timer, manual advancement. Designed to feel more like an adult wellness app.

### Tier Color Palette Alignment

The `colors.tier` tokens match the `useAgeTheme` backgrounds exactly:
- `colors.tier.seedling.bg` (`#FFF8E1`) = `THEME_MAP.seedling.backgroundColor`
- `colors.tier.explorer.bg` (`#F1F8E9`) = `THEME_MAP.explorer.backgroundColor`
- `colors.tier.yogi.bg` (`#E8EAF6`) = `THEME_MAP.yogi.backgroundColor`

Use `colors.tier[tier].bg` and `colors.tier[tier].accent` when you need tier-specific values outside of the hook (e.g., static style declarations that don't have access to React context).
