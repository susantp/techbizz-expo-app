import { getPortfolioOrigin, type PortfolioSource } from './config';
export async function handlePortfolioRequest(source: PortfolioSource): Promise<Response> {
  let origin: string;
  try { origin = getPortfolioOrigin(source); } catch { return Response.json({ error: 'Content source is unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const upstream = await fetch(origin + '/api/content', { headers: { Accept: 'application/json' }, signal: controller.signal, cache: 'no-store' });
    if (!upstream.ok || !/^application\/json(?:\s*;|$)/i.test(upstream.headers.get('content-type') ?? '')) throw new Error('Invalid upstream response');
    return Response.json(await upstream.json(), { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Content source is unavailable.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } }); }
  finally { clearTimeout(timeout); }
}
