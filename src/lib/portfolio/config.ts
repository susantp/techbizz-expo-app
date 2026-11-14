export type PortfolioSource = 'company' | 'personal';
const origins: Record<PortfolioSource, string | undefined> = { company: process.env.EXPO_PUBLIC_COMPANY_ORIGIN, personal: process.env.EXPO_PUBLIC_PERSONAL_ORIGIN };
export function getPortfolioOrigin(source: PortfolioSource): string {
  const value = origins[source];
  if (!value) throw new Error(source + ' origin is not configured');
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(source + ' origin is invalid'); }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) throw new Error(source + ' origin is invalid');
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error(source + ' origin must use HTTPS in production');
  return url.origin;
}
