import { getJson } from '../remote/get-json';
import { getPortfolioOrigin, type PortfolioSource } from './config';
import { portfolioSchemas, type CompanyContent, type PersonalContent } from './model';

async function getPortfolioPayload(source: PortfolioSource, signal?: AbortSignal): Promise<unknown> {
  const path = process.env.EXPO_OS === 'web'
    ? '/api/portfolio/' + source
    : getPortfolioOrigin(source) + '/api/content';
  return getJson(path, { signal });
}

export async function fetchCompanyContent(signal?: AbortSignal): Promise<CompanyContent> {
  return portfolioSchemas.company.parse(await getPortfolioPayload('company', signal));
}

export async function fetchPersonalContent(signal?: AbortSignal): Promise<PersonalContent> {
  return portfolioSchemas.personal.parse(await getPortfolioPayload('personal', signal));
}
