import { getPortfolioOrigin, type PortfolioSource } from './config';
import { readCompanyContent, readPersonalContent } from './model';
export async function requestPortfolio(source: PortfolioSource, signal?: AbortSignal) {
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8000), abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  try {
    const path = process.env.EXPO_OS === 'web' ? '/api/portfolio/' + source : getPortfolioOrigin(source) + '/api/content';
    const response = await fetch(path, { headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!response.ok) throw new Error(source + ' request failed with HTTP ' + response.status);
    if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') ?? '')) throw new Error(source + ' response is not JSON');
    const payload: unknown = await response.json();
    return source === 'company' ? readCompanyContent(payload) : readPersonalContent(payload);
  } finally { clearTimeout(timeout); signal?.removeEventListener('abort', abort); }
}
