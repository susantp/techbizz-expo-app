# API contracts and typing

## P0 · Runtime contracts

- Use Zod for new or changed API boundaries. Reuse a schema that already owns the wire contract when it can be imported across the relevant build targets. Otherwise, define a consumer schema for the fields the app reads and check it against source fixtures or live local responses. A TypeScript interface or a cast on `response.json()` cannot validate the payload.
- Treat incoming JSON as `unknown`. For HTTP clients, check the status and media type, then parse the payload before passing it to state or UI. Use `safeParse` when handling a failed parse explicitly. Derive types with `z.infer` (or `z.output` after transforms) and use `z.input` when the schema has a different input shape. Avoid maintaining a second handwritten type for the same shape.
- Explicitly model required, optional, and nullable values using evidence from the source contract. Map validated wire data to the display model at the boundary. Keep unrelated API additions compatible. Use a direct runtime dependency in any package importing Zod. Verify dependency ownership in `package.json` and the lockfile before writing imports.

## P1 · Portfolio integration

- Keep company and personal schemas distinct. Both feeds use `{ layout, page }`, but their fields differ. Keep the source key tied to its parser, returned type, and state slot. Avoid storing a union under a computed key without narrowing the key and payload together.
- Follow the published field policy. Required company content must validate. Unusable optional Email and WhatsApp values should disappear independently. An invalid personal image keeps the name available and falls back to initials. Unknown icon IDs use a UI fallback. Never let a failed refresh replace last good data.
- The Expo web proxies forward the complete upstream JSON. If validating a proxied response, use the schema result as a gate and forward the original parsed JSON after success, so schema stripping or transforms cannot change the response. Keep the documented HTTP error mapping and cache headers.

## P2 · Current Expo gap

- Snapshot 2026-11-15. `src/lib/portfolio/model.ts` validates fields with handwritten readers and separately declares their types. `src/lib/portfolio/request.ts` parses JSON as `unknown`, but returns a union for the source key. `src/lib/portfolio/provider.tsx` writes through a computed key, so the key-to-payload relationship is not explicit at that write. The initial plan specified handwritten readers and no new packages. It did not make reuse of Zod or source-specific typing an acceptance requirement.
- Zod 4.6.7 resolves from Expo’s installed dependencies and 4.6.4 from the company portfolio’s. Neither declares Zod directly in `package.json`. If migrating Expo to schemas, declare Zod as a direct runtime dependency and keep the existing response, normalization, and recovery behavior.
- Acceptance for that migration should cover valid and malformed local payloads for each route, optional field degradation, unknown icons, the typed source-to-result relationship, and full JSON parity at both web proxies. Keep this as a separate implementation task from the completed front door plan.

Reference: [Zod parsing and inferred types](https://zod.dev/basics).
