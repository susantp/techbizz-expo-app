import { Redirect, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import * as Linking from 'expo-linking';

import { CompanyAction, projectActionLabel } from '@/components/company/company-action';
import { ContentStatus } from '@/components/company/content-status';
import { LeadershipCard } from '@/components/company/leadership-card';
import { CompanySection, PageTitle, ScreenShell } from '@/components/company/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent, usePersonalContent } from '@/lib/portfolio/hooks';

export default function CompanyScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  if (section === 'contact') return <Redirect href="/contact" />;
  return <CompanyOverview />;
}

function CompanyOverview() {
  const company = useCompanyContent();
  const [personalEnabled, setPersonalEnabled] = useState(false);
  const [privacyLinkFailed, setPrivacyLinkFailed] = useState(false);
  const personal = usePersonalContent(personalEnabled);
  const [intro, ...rest] = company.data?.whyParagraphs ?? [];

  async function openPrivacyPolicy() {
    setPrivacyLinkFailed(false);
    try {
      await Linking.openURL('https://www.techbizznepal.com/privacy-policy');
    } catch {
      setPrivacyLinkFailed(true);
    }
  }

  useFocusEffect(useCallback(() => {
    setPersonalEnabled(true);
  }, []));

  return (
    <ScreenShell topPadding>
      <CompanySection>
        <PageTitle>Company</PageTitle>
        <CompanyAction label="Privacy policy" onPress={() => void openPrivacyPolicy()} />
        {privacyLinkFailed && <ThemedText accessibilityRole="alert">Could not open the privacy policy.</ThemedText>}
        <ContentStatus hasData={!!company.data} status={company.status} retry={company.retry} unavailable="Company information is unavailable." />
        {intro && <ThemedText selectable themeColor="textSecondary">{intro}</ThemedText>}
      </CompanySection>
      <CompanySection title="Leadership">
        <ContentStatus hasData={!!personal.data} status={personal.status} retry={personal.retry} unavailable="Leadership profile is unavailable." />
        {personal.data && <LeadershipCard person={personal.data} />}
      </CompanySection>
      {!!rest.length && (
        <CompanySection title="Why choose us">
          {rest.map((paragraph, index) => <ThemedText selectable key={index}>{paragraph}</ThemedText>)}
        </CompanySection>
      )}
      <CompanyAction label={projectActionLabel} href="/contact" primary />
    </ScreenShell>
  );
}
