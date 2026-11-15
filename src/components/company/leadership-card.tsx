import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CompanyTypography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PersonalContent } from '@/lib/portfolio/model';

type LeadershipCardProps = { person: PersonalContent };

export function LeadershipCard({ person }: LeadershipCardProps) {
  const theme = useTheme();
  const [failedImage, setFailedImage] = useState<string>();
  const origin = process.env.EXPO_PUBLIC_PERSONAL_ORIGIN;
  const source = person.image?.startsWith('/') ? (origin && origin + person.image) : person.image;
  const initials = person.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={styles.card}>
      {source && failedImage !== source ? (
        <Image
          source={source}
          style={styles.portrait}
          contentFit="cover"
          accessibilityLabel={person.name}
          onError={() => setFailedImage(source)}
        />
      ) : (
        <View aria-hidden style={[styles.portrait, styles.fallback, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={CompanyTypography.section}>{initials}</ThemedText>
        </View>
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <ThemedText selectable style={CompanyTypography.section}>{person.name}</ThemedText>
        <ThemedText selectable themeColor="textSecondary">CEO, Tech Bizz</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  portrait: { width: 96, height: 96, borderRadius: 20 },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
