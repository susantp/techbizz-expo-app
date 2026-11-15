import { useRouter } from 'expo-router';

import { CompanyAction, projectActionLabel } from '@/components/company/company-action';
import { ContactOptions } from '@/components/company/contact-options';
import { ContentStatus } from '@/components/company/content-status';
import { CompanySection, PageTitle, ScreenShell } from '@/components/company/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useCompanyContent } from '@/lib/portfolio/hooks';

export default function ContactScreen() {
  const router = useRouter();
  const { data, status, retry } = useCompanyContent();

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <ScreenShell topPadding>
      <CompanySection>
        <CompanyAction label={process.env.EXPO_OS === 'web' ? 'Back' : 'Close'} onPress={close} />
        <PageTitle>{projectActionLabel}</PageTitle>
        <ThemedText selectable themeColor="textSecondary">Choose how you’d like to reach Tech Bizz.</ThemedText>
      </CompanySection>
      <ContentStatus hasData={!!data} status={status} retry={retry} unavailable="Company information is unavailable." />
      {data && <ContactOptions email={data.email} phone={data.phone} />}
    </ScreenShell>
  );
}
