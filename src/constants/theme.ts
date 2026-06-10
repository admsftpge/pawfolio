/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Components reference these roles, never raw hex — repainting the app is an
// edit to this block only.
export const Colors = {
  light: {
    text: '#231F1A',
    background: '#FAF3E8',
    backgroundElement: '#F3EADB',
    backgroundSelected: '#E9DCC6',
    textSecondary: '#6B6256',
    danger: '#DC2626',
    dangerSoft: '#FBE5E0',
    success: '#16A34A',
    successSoft: '#E0F2E4',
    surface: '#FFFFFF',
    border: '#E9DCC6',
    accent: '#D97706',
    accentOn: '#FFFFFF',
  },
  dark: {
    text: '#F5F1EA',
    background: '#15120E',
    backgroundElement: '#221E17',
    backgroundSelected: '#2F2920',
    textSecondary: '#B5AC9F',
    danger: '#F87171',
    dangerSoft: '#3D241F',
    success: '#4ADE80',
    successSoft: '#1E3325',
    surface: '#1C1814',
    border: '#2F2920',
    accent: '#F59E0B',
    accentOn: '#231F1A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
export const MaxContentWidth = 800;
