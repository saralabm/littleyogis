# Product Overview — Little Yogi Wellness

---

## Vision

Little Yogi Wellness brings yoga and mindful breathing to children ages 4–12 in a form that is developmentally appropriate, playful, and safe. The app makes the benefits of yoga — physical flexibility, emotional regulation, breath awareness — accessible to young children who would otherwise find adult wellness apps impenetrable.

The core insight is that the same yoga practice can be presented differently for a 5-year-old (who needs a mascot, animal pose names, auto-advance, and short sessions) and an 11-year-old (who can handle Sanskrit terminology, longer holds, and full session metrics). The app handles that adaptation automatically, invisibly, based on a single configuration choice made by a parent at setup time.

---

## Product Purpose

The app serves two distinct use cases:

1. **Symptom-driven sessions.** A child is experiencing something — a headache, tight legs, anxiety before school, difficulty sleeping. The mood picker and body map on the Home screen route them directly to the relevant ailment and a pre-built session.

2. **Exploratory practice.** A child browses the ailment library by category (Physical or Emotional) or the breathing exercise library to find something interesting, regardless of a specific complaint.

In both cases, the experience is self-contained: the child can navigate to a session and complete it without parental involvement, as long as onboarding has been completed once.

---

## Target Audience

### Children (Primary Users)

Ages 4–12, divided into three developmental tiers:

- **Seedling (4–6):** Pre-readers and early readers. The experience is maximal in warmth and minimal in cognitive demand. Large text, a friendly mascot (Yogi emoji), animal pose names ("Butterfly"), very short sessions, auto-advance so the child doesn't get stuck. No streak pressure.

- **Explorer (7–9):** Independent readers who respond to mild gamification. Standard font sizes, a smaller mascot, a streak counter as positive reinforcement, manual session control, introduction of some Sanskrit pose names.

- **Yogi (10–12):** Pre-teens who want to be taken seriously. No mascot, full Sanskrit terminology, all metrics visible (streak and breath count), information-dense layout. The closest to an adult wellness experience.

### Parents and Guardians (Setup Users)

Parents complete a guided 5-screen onboarding to configure the app for their child. They select the age tier, enter the child's preferred name, accept a medical disclaimer, and optionally set a PIN to protect settings. After setup, the parent is not involved in the day-to-day experience.

---

## Core Value Proposition

| For whom | Value |
|---|---|
| Child (any tier) | Guided wellness sessions they can do independently |
| Child (Seedling) | Zero cognitive friction; the app literally advances for them |
| Child (Explorer/Yogi) | Progressively more information and control as they grow |
| Parent | One-time safe setup; PIN protection; medical disclaimer; contraindication alerts |
| All users | Fully offline — no account, no subscription, no tracking |

---

## Main Experiences

### Home Screen

The child's daily starting point. A time-of-day greeting uses their name. A mood picker (six emoji options) and a body map (seven body zones) let them express what they're feeling or what hurts, and routes them directly to the relevant session.

### Yoga Session

A full-screen session built from the ailment's pose list, filtered for the child's age tier. The session player shows the current pose name (in age-appropriate terminology), a countdown timer (jar-style for Seedling, ring-style for others), and back/pause/forward controls. Contraindication alerts and pose instructions are surfaced in context. Audio narration is available via a toggle.

### Breathing Library

Nine breathing exercises with playful names (Balloon Breathing, Dragon Breath, Bumblebee Breath, etc.) presented in a colorful 3-column grid. Each exercise guides the child through timed inhale/hold/exhale cycles with a visual phase indicator and round counter.

### Ailment Library

Sixteen conditions — eight physical (constipation, poor posture, low energy, headaches, tight hamstrings, weight support, coordination, asthma) and eight emotional (anxiety, anger, hyperactivity, ADHD, sleep issues, exam stress, emotional overwhelm, low confidence) — each with a color-coded card, pose list, and recommended breathing exercise.

### Progress and Profile

The Me tab shows the child's streak count and allows a parent (PIN-protected) to update the age tier as the child grows. Completed sessions are persisted locally so the streak survives app restarts.

---

## Current Product Capabilities

All core experiences described above are implemented. The app is functional as a prototype. Known gaps before production release:

- Lottie animation assets for poses are not yet bundled.
- Audio bell files are not yet bundled.
- The breathing player uses a solid background color instead of the full gradient.
- Mood rating UI on the session completion screen is not yet built (the store is ready).

---

## Product Principles

1. **The child is the user.** Every visible UI decision (language, font size, mascot, session length) is oriented toward the child in the active tier, not the parent.

2. **Safety is non-negotiable.** Contraindication alerts, a SafetyBanner for medically sensitive ailments, and a required medical disclaimer reflect that this product touches physical and emotional health.

3. **Age-progressive complexity.** Younger tiers get more support; older tiers get more information. The app should feel appropriately sophisticated at every tier.

4. **Offline and private.** No network calls, no accounts, no analytics. The child's health data stays on the device.

5. **Parent in control, child in flow.** The parent configures once; the child explores freely within the configured context. The PIN gate prevents accidental or unauthorized tier changes.
