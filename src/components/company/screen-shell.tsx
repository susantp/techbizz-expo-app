import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { CompanyTypography, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenShellProps = { children: ReactNode; topPadding?: boolean };

export function ScreenShell({ children, topPadding = false }: ScreenShellProps) {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const android = process.env.EXPO_OS === 'android';

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: width >= 720 ? 32 : 20,
          paddingTop: 24 + (android && topPadding ? top : 0),
          paddingBottom: 32 + (android ? bottom : 0),
        },
      ]}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

type CompanySectionProps = { title?: string; children: ReactNode };

export function CompanySection({ title, children }: CompanySectionProps) {
  return (
    <View style={styles.group}>
      {title && <ThemedText accessibilityRole="header" aria-level={2} style={CompanyTypography.section}>{title}</ThemedText>}
      {children}
    </View>
  );
}

type PageTitleProps = { children: string };

export function PageTitle({ children }: PageTitleProps) {
  return <ThemedText accessibilityRole="header" aria-level={1} style={CompanyTypography.page}>{children}</ThemedText>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center' },
  inner: { width: '100%', maxWidth: MaxContentWidth, gap: 32 },
  group: { gap: 12 },
});
