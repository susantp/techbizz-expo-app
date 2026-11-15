import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { useTheme } from '@/hooks/use-theme';

const symbols = {
  'web-development': { ios: 'globe', android: 'work', web: 'work' },
  'e-commerce-solution': { ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' },
  'android-development': { ios: 'apps.iphone', android: 'android', web: 'android' },
  'web-designing': { ios: 'paintbrush', android: 'design_services', web: 'design_services' },
  'responsive-web-design': { ios: 'display', android: 'devices', web: 'devices' },
  seo: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  analysis: { ios: 'chart.bar', android: 'analytics', web: 'analytics' },
  designing: { ios: 'pencil.and.ruler', android: 'draw', web: 'draw' },
  development: { ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code' },
  testing: { ios: 'speedometer', android: 'speed', web: 'speed' },
  launch: { ios: 'paperplane', android: 'rocket_launch', web: 'rocket_launch' },
} as const;

export type CompanyIconId = keyof typeof symbols;

export function ContentIcon({ id, size = 28 }: { id: string; size?: number }) {
  const tintColor = useTheme().action;
  const name = symbols[id as CompanyIconId] ?? { ios: 'briefcase', android: 'work', web: 'work' };
  return <SymbolView name={name as SymbolViewProps['name']} size={size} tintColor={tintColor} />;
}
