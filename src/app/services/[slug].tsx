import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { CompanyAction, projectActionLabel } from '@/components/company/company-action';
import { ContentStatus } from '@/components/company/content-status';
import { CompanySection, PageTitle, ScreenShell } from '@/components/company/screen-shell';
import { getServiceCopy } from '@/components/company/service-copy';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent } from '@/lib/portfolio/hooks';

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data, status, retry } = useCompanyContent();
  const service = data?.services.find(item => item.slug === slug);
  const copy = service && getServiceCopy(service);
  const title = copy?.label ?? (data ? 'Service unavailable' : 'Services');

  return (
    <ScreenShell>
      <Stack.Screen options={{
        title,
        headerBackVisible: false,
        headerLeft: () => <CompanyAction label="Services" onPress={() => router.dismissTo('/services')} />,
      }} />
      <CompanySection>
        <PageTitle>{title}</PageTitle>
        <ContentStatus hasData={!!data} status={status} retry={retry} unavailable="Services are unavailable." />
        {copy?.known && <ThemedText selectable themeColor="textSecondary">{copy.preview}</ThemedText>}
      </CompanySection>
      {service ? (
        <>
          <CompanySection title="What we offer">
            <ThemedText selectable>{service.description}</ThemedText>
          </CompanySection>
          <CompanyAction label={projectActionLabel} href="/contact" primary />
        </>
      ) : (
        <CompanyAction label="Browse services" onPress={() => router.dismissTo('/services')} />
      )}
    </ScreenShell>
  );
}
