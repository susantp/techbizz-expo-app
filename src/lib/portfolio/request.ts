import { getJson } from '../remote/get-json';
import { getPortfolioOrigin, type PortfolioSource } from './config';
import { portfolioSchemas, type PortfolioContent } from './model';

type PortfolioResult = {
  [Source in PortfolioSource]: { source: Source; data: PortfolioContent[Source] };
}[PortfolioSource];

export async function requestPortfolio(
  source: PortfolioSource,
  signal?: AbortSignal,
): Promise<PortfolioResult> {
  const path = process.env.EXPO_OS === 'web'
    ? '/api/portfolio/' + source
    : getPortfolioOrigin(source) + '/api/content';
  const payload = await getJson(path, { signal });
  if (source === 'company') {
    return { source, data: portfolioSchemas.company.parse(payload) };
  }
  return { source, data: portfolioSchemas.personal.parse(payload) };
}
