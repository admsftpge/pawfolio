import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  text: '#1B1B1F',
  background: '#EEF1F4',
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#E2E7EC',
  textSecondary: '#6A7280',
  danger: '#E03131',
  dangerSoft: '#FCE4E4',
  success: '#2F9E44',
  successSoft: '#E3F7E8',
  surface: '#FFFFFF',
  border: '#E3E8EE',
  accent: '#E5483D',
  accentOn: '#FFFFFF',
} as const;

export type ThemeColor = keyof typeof Colors;

export const Motif = {
  lens: '#3FA2F6',
  lensHighlight: 'rgba(255, 255, 255, 0.55)',
  leds: ['#FF5A5A', '#FFD23F', '#43D17A'],
  body: '#C2C9D2',
  outline: '#1B1B1F',
  title: '#FFCB05',
  titleOutline: '#2A75BB',
} as const;

export const DisplayFont = 'LuckiestGuy_400Regular';

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

export const MaxContentWidth = 720;
export const FormMaxWidth = 480;
