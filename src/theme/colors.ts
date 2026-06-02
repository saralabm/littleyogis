export const colors = {
  primary: {
    sunshine: '#F9A825',
    meadow: '#66BB6A',
  },
  secondary: {
    sky: '#42A5F5',
    lavender: '#9575CD',
    coral: '#EF6C00',
    rose: '#EC407A',
  },
  accent: {
    mint: '#80CBC4',
    peach: '#FFAB76',
    lemon: '#FFF176',
  },
  bg: {
    primary: '#FFFBF2',
    card: '#FFFFFF',
    dark: '#1A1A2E',
  },
  text: {
    primary: '#1C1C2E',
    body: '#3D3D56',
    muted: '#7B7B99',
    onDark: '#F0F0FF',
  },
  tier: {
    seedling: { bg: '#FFF8E1', accent: '#FFB300' },
    explorer: { bg: '#F1F8E9', accent: '#558B2F' },
    yogi:     { bg: '#E8EAF6', accent: '#3949AB' },
  },
  breathingGradients: {
    'balloon-breathing':   ['#81C784', '#A5D6A7'] as [string, string],
    'bumblebee-breath':    ['#FFB300', '#FFD54F'] as [string, string],
    'box-breathing':       ['#7986CB', '#9FA8DA'] as [string, string],
    'dragon-breath':       ['#EF5350', '#FF7043'] as [string, string],
    'ocean-breathing':     ['#0288D1', '#4FC3F7'] as [string, string],
    'rainbow-breathing':   ['#E91E63', '#FF9800'] as [string, string],
    'belly-breathing':     ['#66BB6A', '#A5D6A7'] as [string, string],
    'star-breathing':      ['#F9A825', '#FFD54F'] as [string, string],
    'flower-breathing':    ['#EC407A', '#F48FB1'] as [string, string],
  },
} as const;

export type Colors = typeof colors;
