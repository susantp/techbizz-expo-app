import { ActionLink, CompanyHeader, ProcessList, RefreshRetry, RetryStatus, Screen, ServiceCard } from '@/components/company/ui';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent } from '@/lib/portfolio/provider';
import { View } from 'react-native';

export default function ServicesScreen() {
  const { data, status, error, retry } = useCompanyContent();
  return <Screen>
    <CompanyHeader content={data} />
    <ThemedText selectable type="subtitle">Services</ThemedText>
    <RetryStatus loading={status === 'loading' && !data} error={error && !data ? error : undefined} retry={retry} emptyText="Company information is unavailable." />
    {error && data && <RefreshRetry onPress={retry} />}
    {data && (data.services.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{data.services.map(item => <ServiceCard key={item.slug} item={item} />)}</View> : <ThemedText selectable>No services listed yet.</ThemedText>)}
    {data?.processes.length ? <ProcessList heading={data.processHeading} items={data.processes} /> : null}
    <ActionLink href="/company?section=contact">Get in touch</ActionLink>
  </Screen>;
}
