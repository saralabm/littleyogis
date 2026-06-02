import type { Insets } from 'react-native';

export const DEFAULT_HIT_SLOP: Insets = { top: 8, bottom: 8, left: 8, right: 8 };

export function makeA11yLabel(label: string, hint?: string): string {
  if (!hint) return label;
  return `${label}. ${hint}`;
}
