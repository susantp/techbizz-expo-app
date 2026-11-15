import { StyleSheet, View } from 'react-native';

import { CompanyAction, projectActionLabel } from '@/components/company/company-action';
import { ContentIcon } from '@/components/company/content-icons';
import { ContentStatus } from '@/components/company/content-status';
import { CompanySection, PageTitle, ScreenShell } from '@/components/company/screen-shell';
import { ServiceRow } from '@/components/company/service-row';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent } from '@/lib/portfolio/hooks';

const processLabels = new Map([
  ['analysis', 'Analysis'],
  ['designing', 'Designing'],
  ['development', 'Development'],
  ['testing', 'Testing'],
  ['launch', 'Launch'],
]);

export default function ServicesScreen() {
  const { data, status, retry } = useCompanyContent();

  return (
    <ScreenShell topPadding>
      <CompanySection>
        <PageTitle>Services</PageTitle>
        <ThemedText selectable themeColor="textSecondary">Choose a service to see how we can help.</ThemedText>
      </CompanySection>
      <ContentStatus hasData={!!data} status={status} retry={retry} unavailable="Services are unavailable." />
      {data && (data.services.length
        ? <View>{data.services.map(service => <ServiceRow key={service.slug} service={service} />)}</View>
        : <ThemedText selectable>No services listed yet.</ThemedText>)}
      {!!data?.processes.length && (
        <CompanySection title="How we work">
          {data.processes.map((process, index) => (
            <View key={process.slug} style={styles.step}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                {processLabels.has(process.slug)
                  ? <ContentIcon id={process.icon} size={22} />
                  : <ThemedText>{index + 1}</ThemedText>}
              </View>
              <ThemedText selectable>{processLabels.get(process.slug) ?? process.title}</ThemedText>
            </View>
          ))}
        </CompanySection>
      )}
      <CompanyAction label={projectActionLabel} href="/contact" primary />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 32 },
});
