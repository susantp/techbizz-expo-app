import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ContentIcon } from '@/components/company/content-icons';
import { getServiceCopy } from '@/components/company/service-copy';
import { ThemedText } from '@/components/themed-text';
import { CompanyTypography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ServiceItem } from '@/lib/portfolio/model';

type ServiceRowProps = { service: ServiceItem };

export function ServiceRow({ service }: ServiceRowProps) {
  const theme = useTheme();
  const { label, preview, known } = getServiceCopy(service);

  return (
    <Link href={{ pathname: '/services/[slug]', params: { slug: service.slug } }} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={label}
        accessibilityHint={known ? preview : undefined}
        style={{ ...styles.row, borderBottomColor: theme.divider }}>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <ContentIcon id={service.icon} size={22} />
        </View>
        <View style={styles.copy}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          <ThemedText
            themeColor="textSecondary"
            style={CompanyTypography.supporting}
            numberOfLines={known ? undefined : 2}>
            {preview}
          </ThemedText>
        </View>
        <ThemedText aria-hidden style={{ fontSize: 24 }} themeColor="textSecondary">›</ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, minHeight: 48 },
  copy: { flex: 1, gap: 4 },
  label: { fontSize: 16, lineHeight: 24, fontWeight: '700' },
});
