import { TextStyle } from 'react-native';

const NUNITO_BOLD = 'Nunito-Bold';
const NUNITO_REGULAR = 'Nunito-Regular';
const NUNITO_SANS_REGULAR = 'NunitoSans-Regular';
const NUNITO_SANS_BOLD = 'NunitoSans-Bold';
const DM_MONO = 'DMMono-Regular';

export const typography: Record<string, TextStyle> = {
  displayXl: {
    fontFamily: NUNITO_BOLD,
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '700',
    letterSpacing: 0.96,
  },
  displayLg: {
    fontFamily: NUNITO_BOLD,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: 0.72,
  },
  heading1: {
    fontFamily: NUNITO_BOLD,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 0.56,
  },
  heading2: {
    fontFamily: NUNITO_BOLD,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: 0.44,
  },
  heading3: {
    fontFamily: NUNITO_BOLD,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: 0.36,
  },
  bodyLg: {
    fontFamily: NUNITO_SANS_BOLD,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
  },
  bodyMd: {
    fontFamily: NUNITO_SANS_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.32,
  },
  bodySm: {
    fontFamily: NUNITO_SANS_REGULAR,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.28,
  },
  timer: {
    fontFamily: DM_MONO,
    fontSize: 64,
    lineHeight: 64,
    fontWeight: '400',
  },
  breathCount: {
    fontFamily: DM_MONO,
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '400',
  },
};
