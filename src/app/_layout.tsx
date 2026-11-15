import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { PortfolioQueryProvider } from '@/lib/portfolio/query-provider';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = process.env.EXPO_OS === 'web' ? {} : { anchor: '(tabs)' };

export default function RootLayout() {
  const baseTheme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  const colors = useTheme();

  return (
    <ThemeProvider value={{
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: colors.background,
        card: colors.background,
        border: colors.divider,
        text: colors.text,
        primary: colors.action,
      },
    }}>
      <PortfolioQueryProvider>
        <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="services/[slug]" options={{ title: 'Services' }} />
          <Stack.Screen name="contact" options={process.env.EXPO_OS === 'web'
            ? { headerShown: false }
            : {
              headerShown: false,
              presentation: 'formSheet',
              sheetAllowedDetents: [0.6, 1],
              sheetGrabberVisible: true,
            }} />
        </Stack>
        <AnimatedSplashOverlay />
      </PortfolioQueryProvider>
    </ThemeProvider>
  );
}
