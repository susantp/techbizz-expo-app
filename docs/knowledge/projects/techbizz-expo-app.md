# Tech Bizz Expo app

Source snapshot: `main@78a9e03` plus local Expo starter fixes, inspected 2026-11-14.

## P0 · Project decisions

- **Decision.** The host app root and package name are `techbizz-expo-app`. The app uses Expo and React Native.

- **Decision.** The app opens on Tech Bizz. Its Company screen uses selected personal portfolio data for the CEO profile. See the [company app implementation plan](../plans/ongoing/company-app-front-door.md).

## P1 · Architecture and workflow

- **Architecture.** Official Expo SDK 58 default template installed with npm. The lockfile resolves Expo 58.0.25, React Native 0.88.1, React 19.3.0, and Expo Router 58.0.31. The app contains Expo sample screens and has no integration with either portfolio in this snapshot.
- **Architecture.** `package.json` enters through `expo-router/entry`. `src/app/_layout.tsx` sets up theme, splash, portfolio content state, and tabs for Home, Services, and Company. The native and web tab implementations are `src/components/app-tabs.tsx` and `app-tabs.web.tsx`. Typed portfolio models and source-specific request state live in `src/lib/portfolio/`; web same-origin GET proxies are `src/app/api/portfolio/company+api.ts` and `personal+api.ts`. Origins are configured in ignored `.env.local` from the checked-in `.env.example`. Native fetches source APIs directly; web fetches through the Expo API routes. The app uses Continuous Native Generation.
- **Workflow.** Run `npm ci`, `npm start`, and `npm run lint`. Check types with `npx tsc --noEmit`. Use `npx expo install` for SDK-compatible dependencies. Follow repo `AGENTS.md` and [SDK 58 docs](https://docs.expo.dev/versions/v58.0.0/). `npm run reset-project` replaces the starter screens after an interactive prompt.

## P2 · Verification

- **Verification.** Lint, TypeScript, Expo export for all platforms, and `git diff --check` passed. Local API JSON matched both Next.js source APIs, and browser and Android checks passed. The iOS bundle exported successfully. The iOS smoke check still needs to be run in Xcode 27 Device Hub. Check public endpoints after the portfolio API revisions deploy. See the [implementation plan and startup steps](../plans/ongoing/company-app-front-door.md).
- **Verification.** npm reported eight moderate dependency advisories after Expo’s lint tooling installation. Recheck against the current lockfile with `npm audit`.
