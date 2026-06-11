import '@/global.css';

import { Platform } from 'react-native';

// Components reference these roles, never raw hex — repainting the app is an
// edit to this block only.
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

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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

// On wide (web/tablet) viewports, cap content so it reads as a centred column
// rather than stretching edge to edge. Grid is roomier; forms are narrower.
export const MaxContentWidth = 720;
export const FormMaxWidth = 480;
