import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export const projectActionLabel = 'Talk about your project';

type CompanyActionProps = {
  label: string;
  primary?: boolean;
} & ({ href: Href; onPress?: never } | { href?: never; onPress: () => void });

export function CompanyAction({ label, primary = false, href, onPress }: CompanyActionProps) {
  const theme = useTheme();
  const controlStyle = StyleSheet.flatten([
    styles.control,
    primary && { backgroundColor: theme.action, paddingHorizontal: 16 },
  ]);
  const control = (
    <Pressable
      accessibilityRole={href ? 'link' : 'button'}
      onPress={onPress}
      style={href ? controlStyle : ({ pressed }) => [controlStyle, pressed && styles.pressed]}>
      <ThemedText style={[styles.label, { color: primary ? theme.actionText : theme.action }]}>{label}</ThemedText>
    </Pressable>
  );

  if (href) return <Link href={href} asChild>{control}</Link>;
  return control;
}

const styles = StyleSheet.create({
  control: { minHeight: 48, alignSelf: 'flex-start', justifyContent: 'center', paddingVertical: 10, borderRadius: 12 },
  label: { fontSize: 16, lineHeight: 24, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
