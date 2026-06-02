export const spacing = {
  xs:   8,
  sm:   16,
  md:   24,
  lg:   32,
  xl:   48,
  xxl:  64,
  screenPaddingH: 20,
  cardPadding: 16,
  cardRadius:   20,
  buttonRadius: 100,
  tagRadius:     8,
  inputRadius:  12,
  minTouchTarget:   44,
  poseControlSize:  56,
  moodEmojiSize:    60,
} as const;

export type Spacing = typeof spacing;
