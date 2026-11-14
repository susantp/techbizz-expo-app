# API contracts and typing

## P0 · Runtime contracts

- Use Zod for new or changed API boundaries. Reuse a schema that already owns the wire contract when it can be imported across the relevant build targets. Otherwise, define a consumer schema for the fields the app reads and check it against source fixtures or live local responses. A TypeScript interface or a cast on `response.json()` cannot validate the payload.
- Treat incoming JSON as `unknown`. For HTTP clients, check the status and media type, then parse the payload before passing it to state or UI. Use `safeParse` when handling a failed parse explicitly. Derive types with `z.infer` (or `z.output` after transforms) and use `z.input` when the schema has a different input shape. Avoid maintaining a second handwritten type for the same shape.
- Explicitly model required, optional, and nullable values using evidence from the source contract. Map validated wire data to the display model at the boundary. Keep unrelated API additions compatible. Use a direct runtime dependency in any package importing Zod. Verify dependency ownership in `package.json` and the lockfile before writing imports.

## P1 · Portfolio integration

- Reuse `src/lib/remote/get-json.ts` for JSON reads. It owns the shared HTTP status and media type checks, JSON decoding, cancellation, and the timeout through body parsing. It returns `unknown` so the endpoint caller explicitly chooses a schema. Endpoint code owns URLs, authentication requirements, validation, and error mapping. The query layer owns retry and caching policy for app data. Extend transport when a second real use calls for it.

- Keep company and personal schemas distinct. Both feeds use `{ layout, page }`, but their fields differ. Keep the source key tied to its parser, returned type, and state slot. Avoid storing a union under a computed key without narrowing the key and payload together.
- Follow the published field policy. Required company content must validate. Unusable optional Email and WhatsApp values should disappear independently. An invalid personal image keeps the name available and falls back to initials. Unknown icon IDs use a UI fallback. Never let a failed refresh replace last good data.
- The Expo web proxies forward the complete upstream JSON. If validating a proxied response, use the schema result as a gate and forward the original parsed JSON after success, so schema stripping or transforms cannot change the response. Keep the documented HTTP error mapping and cache headers.

## P2 · Expo implementation

- `src/lib/portfolio/model.ts` owns both consumer schemas and infers their output types. `request.ts` returns the parsed result with its source key, which `provider.tsx` narrows before updating state. `web-handler.ts` validates using the same schemas and forwards the complete upstream JSON on success. Expo declares Zod 4.6.7 as a direct runtime dependency.

Reference: [Zod parsing and inferred types](https://zod.dev/basics).
