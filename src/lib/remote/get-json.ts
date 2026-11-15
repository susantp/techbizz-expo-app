type GetJsonOptions = {
  signal?: AbortSignal;
  cache?: RequestCache;
  timeoutMs?: number;
};

export async function getJson(
  url: string,
  { signal, cache, timeoutMs = 8000 }: GetJsonOptions = {},
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      ...(cache === undefined ? {} : { cache }),
    });
    if (!response.ok) throw new Error(`Remote request failed with HTTP ${response.status}`);

    const mediaType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
    if (mediaType !== 'application/json') throw new Error('Remote response is not JSON');

    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
