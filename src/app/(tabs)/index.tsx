import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompanyAction, projectActionLabel } from '@/components/company/company-action';
import { ContentStatus } from '@/components/company/content-status';
import { CompanySection, ScreenShell } from '@/components/company/screen-shell';
import { featuredServiceSlugs } from '@/components/company/service-copy';
import { ServiceRow } from '@/components/company/service-row';
import { ThemedText } from '@/components/themed-text';
import { CompanyTypography } from '@/constants/theme';
import { useCompanyContent } from '@/lib/portfolio/hooks';

export default function HomeScreen() {
  const { data, status, retry } = useCompanyContent();
  const [failedLogo, setFailedLogo] = useState<string>();
  const path = data?.logo.imagePath;
  const origin = process.env.EXPO_PUBLIC_COMPANY_ORIGIN;
  const logo = path?.startsWith('/') ? (origin && origin + path) : path;
  const featured = featuredServiceSlugs.flatMap(slug => {
    const service = data?.services.find(item => item.slug === slug);
    return service ? [service] : [];
  });

  return (
    <ScreenShell topPadding>
      <View style={styles.wordmark}>
        {logo && failedLogo !== logo && (
          <Image
            source={logo}
            style={styles.logo}
            contentFit="contain"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onError={() => setFailedLogo(logo)}
          />
        )}
        <ThemedText style={styles.brand}>Tech Bizz</ThemedText>
      </View>
      <CompanySection>
        <ThemedText accessibilityRole="header" aria-level={1} style={CompanyTypography.hero}>
          Launch a website, online store, or Android app.
        </ThemedText>
        <ThemedText selectable themeColor="textSecondary">
          Tell us what you’re building. We’ll help you choose the right next step.
        </ThemedText>
        <CompanyAction label={projectActionLabel} href="/contact" primary />
        <CompanyAction label="Explore services" href="/services" />
      </CompanySection>
      <ContentStatus hasData={!!data} status={status} retry={retry} unavailable="Services are unavailable." />
      {!!featured.length && (
        <CompanySection title="What we can help with">
          {featured.map(service => <ServiceRow key={service.slug} service={service} />)}
        </CompanySection>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 26, height: 26 },
  brand: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
});
