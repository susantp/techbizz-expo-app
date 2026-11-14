import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState, type ReactNode, type RefObject } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View, useWindowDimensions, type ScrollViewInstance, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import { ContentIcon } from '@/components/company/content-icons';
import { useTheme } from '@/hooks/use-theme';
import type { CompanyContent, PersonalContent, ProcessItem, ServiceItem } from '@/lib/portfolio/model';

export function Screen({ children, scrollRef, onContentSizeChange }: { children: ReactNode; scrollRef?: RefObject<ScrollViewInstance | null>; onContentSizeChange?: ScrollViewProps['onContentSizeChange'] }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return <ScrollView ref={scrollRef} onContentSizeChange={onContentSizeChange} contentInsetAdjustmentBehavior="automatic" style={[styles.scroll, { backgroundColor: theme.background }]} contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 20) + 24 }]}>
    <View style={styles.inner}>{children}</View>
  </ScrollView>;
}

export function Section({ title, children, onLayout }: { title: string; children: ReactNode; onLayout?: (y: number) => void }) {
  return <View onLayout={event => onLayout?.(event.nativeEvent.layout.y)} style={styles.section}><ThemedText selectable type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>{children}</View>;
}

export function ActionLink({ href, children }: { href: '/services' | '/company?section=contact'; children: string }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={styles.action}>
        <ThemedText selectable style={styles.actionText}>{children}</ThemedText>
      </Pressable>
    </Link>
  );
}

export function RetryStatus({ loading, error, retry, emptyText }: { loading: boolean; error?: Error; retry: () => void; emptyText: string }) {
  if (loading) return <ThemedText accessibilityRole="progressbar" selectable>Loading…</ThemedText>;
  if (!error) return null;
  return <View style={styles.status}><ThemedText selectable>{emptyText}</ThemedText><Pressable accessibilityRole="button" accessibilityLabel="Retry loading content" onPress={retry} style={styles.action}><ThemedText selectable style={styles.actionText}>Retry</ThemedText></Pressable></View>;
}

export function RefreshRetry({ onPress }: { onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="Retry refreshing content" onPress={onPress} style={styles.retry}><ThemedText selectable style={styles.retryText}>Content could not be refreshed. Retry</ThemedText></Pressable>;
}

export function CompanyHeader({ content }: { content?: CompanyContent }) {
  const [imageFailed, setImageFailed] = useState(false);
  const colorScheme = useColorScheme();
  const tint = colorScheme === 'dark' ? '#FDBA74' : '#C2410C';
  const origin = process.env.EXPO_PUBLIC_COMPANY_ORIGIN;
  const source = content?.logo.imagePath.startsWith('/') ? origin + content.logo.imagePath : content?.logo.imagePath;
  return <View style={styles.brand}>
    <View style={styles.logoBox}>{source && !imageFailed ? <Image source={{ uri: source }} onError={() => setImageFailed(true)} contentFit="contain" style={styles.logo} accessibilityLabel={content?.logo.title ?? 'Tech Bizz logo'} /> : <ThemedText style={{ color: tint, fontWeight: '700' }}>TB</ThemedText>}</View>
    <ThemedText selectable type="title" style={styles.brandName}>{content?.logo.title ?? 'Tech Bizz'}</ThemedText>
  </View>;
}

export function ServiceCard({ item, compact = false }: { item: ServiceItem; compact?: boolean }) {
  const { width } = useWindowDimensions();
  const columns = width >= 720 ? 2 : 1;
  return <ThemedView type="backgroundElement" style={[styles.card, compact && styles.compactCard, !compact && columns === 2 && styles.gridCard]}>
    <View accessibilityElementsHidden><ContentIcon id={item.icon} size={26} /></View>
    <ThemedText selectable type="smallBold">{item.title}</ThemedText>
    <ThemedText selectable>{item.description}</ThemedText>
  </ThemedView>;
}

export function ProcessList({ heading, items }: { heading: string; items: ProcessItem[] }) {
  return <Section title={heading}>{items.map((item, index) => <View key={item.slug} style={styles.processRow}>
    <View accessibilityElementsHidden style={styles.step}>{item.icon in processIconIds ? <ContentIcon id={item.icon} size={24} /> : <ThemedText>{index + 1}</ThemedText>}</View>
    <ThemedText selectable>{item.title}</ThemedText>
  </View>)}</Section>;
}

export function ContactActions({ content, onFailure }: { content: CompanyContent; onFailure: () => void }) {
  return <View style={styles.actions}>
    {content.email && <Pressable accessibilityRole="link" accessibilityLabel="Email Tech Bizz" onPress={() => void import('expo-linking').then(Linking => Linking.openURL('mailto:' + content.email)).catch(onFailure)} style={styles.action}><ThemedText selectable style={styles.actionText}>Email Tech Bizz</ThemedText></Pressable>}
    {content.phone && <Pressable accessibilityRole="link" accessibilityLabel="Chat with Tech Bizz on WhatsApp" onPress={() => void import('expo-linking').then(Linking => Linking.openURL('https://wa.me/' + content.phone)).catch(onFailure)} style={styles.action}><ThemedText selectable style={styles.actionText}>WhatsApp</ThemedText></Pressable>}
  </View>;
}

export function LeadershipCard({ person }: { person: PersonalContent }) {
  const [imageFailed, setImageFailed] = useState(false);
  const source = person.image ? (person.image.startsWith('/') ? process.env.EXPO_PUBLIC_PERSONAL_ORIGIN + person.image : person.image) : undefined;
  const initials = person.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return <ThemedView type="backgroundElement" style={styles.leader}>
    {source && !imageFailed ? <Image source={{ uri: source }} contentFit="cover" onError={() => setImageFailed(true)} style={styles.portrait} accessibilityLabel={person.name} /> : <View accessibilityElementsHidden style={[styles.portrait, styles.initials]}><ThemedText type="subtitle">{initials}</ThemedText></View>}
    <View style={styles.leaderCopy}><ThemedText selectable type="smallBold">{person.name}</ThemedText><ThemedText selectable>CEO, Tech Bizz</ThemedText></View>
  </ThemedView>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, content: { paddingHorizontal: 20, alignItems: 'center' }, inner: { width: '100%', maxWidth: MaxContentWidth, gap: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 16 }, logoBox: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }, logo: { width: 64, height: 64 }, brandName: { fontSize: 30, lineHeight: 36 },
  section: { gap: 16 }, sectionTitle: { fontSize: 24, lineHeight: 30 }, action: { minHeight: 48, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: '#C2410C' }, actionText: { color: '#fff', fontWeight: '700' }, retry: { minHeight: 48, justifyContent: 'center' }, retryText: { color: '#C2410C', fontWeight: '700' }, pressed: { opacity: 0.75 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, status: { gap: 8 }, serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, card: { padding: 18, gap: 8, borderRadius: 16, flexGrow: 1, flexBasis: '100%' }, compactCard: { flexBasis: 'auto' }, gridCard: { flexBasis: '46%' }, processRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 16 }, step: { width: 36, alignItems: 'center' },
  leader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderRadius: 16 }, portrait: { width: 88, height: 88, borderRadius: 44 }, initials: { alignItems: 'center', justifyContent: 'center' }, leaderCopy: { gap: 4 },
});
const processIconIds: Record<string, true> = { analysis: true, designing: true, development: true, testing: true, launch: true };
