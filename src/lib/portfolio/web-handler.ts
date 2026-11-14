import { getJson } from '../remote/get-json';
import { getPortfolioOrigin, type PortfolioSource } from './config';
import { portfolioSchemas } from './model';

function unavailable(status: 502 | 503): Response {
  return Response.json(
    { error: 'Content source is unavailable.' },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function handlePortfolioRequest(source: PortfolioSource): Promise<Response> {
  let origin: string;
  try {
    origin = getPortfolioOrigin(source);
  } catch {
    return unavailable(503);
  }

  try {
    const payload = await getJson(origin + '/api/content', { cache: 'no-store' });
    if (!portfolioSchemas[source].safeParse(payload).success) return unavailable(502);

    return Response.json(payload, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return unavailable(502);
  }
}
