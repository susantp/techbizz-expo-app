# Tech Bizz Expo app

Source snapshot: `main@78a9e03` plus local Expo starter fixes, inspected 2026-11-14.

## P0 · Project decisions

- **Decision.** The host app root and package name are `techbizz-expo-app`. The app uses Expo and React Native.

- **Decision.** The app opens on Tech Bizz. Its Company screen uses selected personal portfolio data for the CEO profile. See the [company app implementation plan](../plans/completed/company-app-front-door.md).

- **Design.** The [Expo company app redesign](../plans/completed/expo-company-ui-redesign.md) defines the project inquiry flow, screen hierarchy, and casing conventions. Its verification log covers web, Android, and iOS.

## P1 · Architecture and workflow

- **Release.** The [Tech Bizz Google Play release plan](../plans/ongoing/techbizz-store-release.md) tracks the privacy policy, Android signing, physical device testing, and the first Google Play release.

- **Workflow.** Use the [API contract and typing guide](../topics/api-contracts-and-typing.md) for portfolio feeds and new API integrations.
- **Decision.** Prefer established libraries for shared infrastructure. Use TanStack Query for remote cache and retry workflows and Jotai when a feature needs shared client state. See the [library and state guide](../topics/library-and-state-choices.md).

- **Architecture.** Expo SDK 58 with Bun for dependency installation and project scripts. The lockfile resolves Expo 58.0.25, React Native 0.88.1, React 19.3.0, and Expo Router 58.0.31.
- **Architecture.** `package.json` enters through `expo-router/entry`. `src/app/_layout.tsx` sets up theme, splash, the TanStack Query client, portfolio query observers, and tabs for Home, Services, and Company. The native and web tab implementations are `src/components/app-tabs.tsx` and `app-tabs.web.tsx`. Zod schemas and source-specific query functions/options/hooks live in `src/lib/portfolio/`; the shared fetch transport is `src/lib/remote/get-json.ts`. Web same-origin GET proxies are `src/app/api/portfolio/company+api.ts` and `personal+api.ts`. Origins are configured in ignored `.env.local` from the checked-in `.env.example`. Native fetches source APIs directly; web fetches through the Expo API routes. The app uses Continuous Native Generation.
- **Workflow.** Run `bun install --frozen-lockfile`, `bun run start`, and `bun run lint`. Check types with `bun run typecheck`. Use `bunx --bun expo install --bun` for SDK-compatible dependencies. Follow repo `AGENTS.md` and [SDK 58 docs](https://docs.expo.dev/versions/v58.0.0/). `bun run reset-project` replaces the starter screens after an interactive prompt.

### Android release command

**Rule.** Queue the EAS cloud build and its Google Play Internal testing submission together. Run this command for each authorized new Android release:

```bash
bunx eas-cli@27.11.0 build --platform android --profile production --auto-submit-with-profile=internal --non-interactive --no-wait
```

Record both EAS IDs and check the build and submission results before retrying. This command omits `--bun` because forcing the CLI to run under Bun has caused a source upload `Content-Length` mismatch. EAS still uses the production profile’s Bun configuration. For an existing build queued without auto submission, use its exact build ID with `eas submit` once. Promotion beyond Internal testing follows the release plan.

## P2 · Verification

- **Workflow.** For native acceptance, use the [Expo device smoke check runbook](../topics/expo-device-smoke-check.md).
- **Verification.** The TanStack Query migration passed local API, browser, Android, and iPhone 17 acceptance on 2026-11-15. See the [completed migration](../plans/completed/expo-portfolio-query-migration.md).

- **Verification.** Lint, TypeScript, Expo export for all platforms, and `git diff --check` passed. Local API JSON matched both Next.js source APIs. Browser, Android emulator, and iPhone 17 Device Hub smoke checks passed. The iOS simulator showed the expected fallback for its missing Mail handler. Check public endpoints after the portfolio API revisions deploy. See the [implementation plan and startup steps](../plans/completed/company-app-front-door.md).
- **Verification.** Review dependency advisories against the current lockfile with `bun audit`.
