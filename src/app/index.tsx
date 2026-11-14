import { ActionLink, CompanyHeader, RefreshRetry, RetryStatus, Screen, Section, ServiceCard } from '@/components/company/ui';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent } from '@/lib/portfolio/provider';
import { View } from 'react-native';

export default function HomeScreen() {
  const { data, status, error, retry } = useCompanyContent();
  return <Screen>
    <CompanyHeader content={data} />
    <RetryStatus loading={status === 'loading' && !data} error={error && !data ? error : undefined} retry={retry} emptyText="Company information is unavailable." />
    {error && data && <RefreshRetry onPress={retry} />}
    {data?.whyParagraphs[0] && <ThemedText selectable>{data.whyParagraphs[0]}</ThemedText>}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      <ActionLink href="/services">Explore services</ActionLink>
      <ActionLink href="/company?section=contact">Get in touch</ActionLink>
    </View>
    {!!data?.services.length && <Section title="Services">{data.services.slice(0, 3).map(item => <ServiceCard key={item.slug} item={item} compact />)}</Section>}
  </Screen>;
}
