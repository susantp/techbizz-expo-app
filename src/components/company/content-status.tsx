import { ActivityIndicator, View } from 'react-native';

import { CompanyAction } from '@/components/company/company-action';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type ContentStatusProps = {
  hasData: boolean;
  status: 'idle' | 'loading' | 'ready' | 'error';
  unavailable: string;
  retry: () => void;
};

export function ContentStatus({ hasData, status, unavailable, retry }: ContentStatusProps) {
  const theme = useTheme();

  if (!hasData && (status === 'idle' || status === 'loading')) {
    return <ActivityIndicator accessibilityLabel="Loading content" color={theme.action} style={{ alignSelf: 'flex-start' }} />;
  }
  if (status !== 'error') return null;

  return (
    <View accessibilityLiveRegion="polite" style={{ gap: 4 }}>
      <ThemedText selectable>{hasData ? 'Content could not be refreshed.' : unavailable}</ThemedText>
      <CompanyAction label="Retry" onPress={retry} />
    </View>
  );
}
