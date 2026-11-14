import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ScrollViewInstance } from 'react-native';

import { CompanyHeader, ContactActions, LeadershipCard, RefreshRetry, RetryStatus, Screen, Section } from '@/components/company/ui';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent, usePersonalContent } from '@/lib/portfolio/provider';

export default function CompanyScreen() {
  const company = useCompanyContent();
  const [personalEnabled, setPersonalEnabled] = useState(false);
  const personal = usePersonalContent(personalEnabled);
  const { section } = useLocalSearchParams<{ section?: string }>();
  const scroll = useRef<ScrollViewInstance>(null);
  const contactY = useRef<number | null>(null);
  const [linkError, setLinkError] = useState(false);

  useFocusEffect(useCallback(() => { setPersonalEnabled(true); }, []));
  const scrollToContact = useCallback(() => {
    if (section === 'contact' && contactY.current !== null) scroll.current?.scrollTo({ y: contactY.current, animated: true });
  }, [section]);
  useEffect(() => { scrollToContact(); }, [scrollToContact, company.status]);

  return <Screen scrollRef={scroll} onContentSizeChange={scrollToContact}>
        <CompanyHeader content={company.data} />
        <ThemedText selectable type="subtitle">Company</ThemedText>
        <RetryStatus loading={company.status === 'loading' && !company.data} error={company.error && !company.data ? company.error : undefined} retry={company.retry} emptyText="Company information is unavailable." />
        {company.error && company.data && <RefreshRetry onPress={company.retry} />}
        {company.data && <>
          <Section title="Contact" onLayout={y => { contactY.current = y; scrollToContact(); }}>
            <ContactActions content={company.data} onFailure={() => setLinkError(true)} />
            {!company.data.email && !company.data.phone && <ThemedText selectable>Contact details are unavailable.</ThemedText>}
            {linkError && <ThemedText accessibilityRole="alert" selectable>Could not open this link.</ThemedText>}
          </Section>
          <Section title={company.data.whyHeading}>{company.data.whyParagraphs.map((paragraph, index) => <ThemedText key={index} selectable>{paragraph}</ThemedText>)}</Section>
        </>}
        <Section title="Leadership">
          <RetryStatus loading={personal.status === 'loading' && !personal.data} error={personal.error && !personal.data ? personal.error : undefined} retry={personal.retry} emptyText="Leadership profile is unavailable." />
          {personal.error && personal.data && <RefreshRetry onPress={personal.retry} />}
          {personal.data && <LeadershipCard person={personal.data} />}
        </Section>
  </Screen>;
}
