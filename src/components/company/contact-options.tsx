import * as Linking from 'expo-linking';
import { useState } from 'react';
import { View } from 'react-native';

import { CompanyAction } from '@/components/company/company-action';
import { ThemedText } from '@/components/themed-text';
import type { CompanyContent } from '@/lib/portfolio/model';

type ContactOptionsProps = Pick<CompanyContent, 'email' | 'phone'>;

export function ContactOptions({ email, phone }: ContactOptionsProps) {
  const [failed, setFailed] = useState(false);

  async function openChannel(url: string) {
    setFailed(false);
    try {
      await Linking.openURL(url);
    } catch {
      setFailed(true);
    }
  }

  if (!email && !phone) return <ThemedText selectable>Contact details are unavailable.</ThemedText>;

  return (
    <View style={{ gap: 12 }}>
      {phone && <CompanyAction label="Chat on WhatsApp" primary onPress={() => void openChannel('https://wa.me/' + phone)} />}
      {email && <CompanyAction label="Send an email" primary={!phone} onPress={() => void openChannel('mailto:' + email)} />}
      {failed && <ThemedText selectable accessibilityRole="alert">Could not open this link.</ThemedText>}
    </View>
  );
}
