/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#211B17',
    background: '#FAF8F4',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EEE7DC',
    textSecondary: '#625A52',
    divider: '#DED6CB',
    action: '#B43B18',
    actionText: '#FFFFFF',
  },
  dark: {
    text: '#F6F0E8',
    background: '#171411',
    backgroundElement: '#23201C',
    backgroundSelected: '#332C25',
    textSecondary: '#C2B7AB',
    divider: '#413A33',
    action: '#FF9B70',
    actionText: '#211B17',
  },
} as const;

export const CompanyTypography = {
  hero: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  page: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  section: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24 },
  supporting: { fontSize: 14, lineHeight: 20 },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
export const MaxContentWidth = 720;
