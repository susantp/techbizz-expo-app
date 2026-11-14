# Tech Bizz Expo app

Source snapshot: `main@78a9e03` plus local Expo starter fixes, inspected 2026-11-14.

## P0 · Project decisions

- **Decision.** The host app root and package name are `techbizz-expo-app`. The app uses Expo and React Native.

## P1 · Architecture and workflow

- **Architecture.** Official Expo SDK 58 default template installed with npm. The lockfile resolves Expo 58.0.25, React Native 0.88.1, React 19.3.0, and Expo Router 58.0.31. The app contains Expo sample screens and has no integration with either portfolio in this snapshot.
- **Architecture.** `package.json` enters through `expo-router/entry`. `src/app/_layout.tsx` sets up theme, splash, and tabs for `/` and `/explore`. `src/components/app-tabs.tsx` supplies native tabs and `app-tabs.web.tsx` supplies custom web tabs. `app.json` configures assets, typed routes, React Compiler, and server-rendered web output. The starter uses Continuous Native Generation.
- **Workflow.** Run `npm ci`, `npm start`, and `npm run lint`. Check types with `npx tsc --noEmit`. Use `npx expo install` for SDK-compatible dependencies. Follow repo `AGENTS.md` and [SDK 58 docs](https://docs.expo.dev/versions/v58.0.0/). `npm run reset-project` replaces the starter screens after an interactive prompt.

## P2 · Verification

- **Verification.** Lint, TypeScript, and `expo export --platform all` passed for iOS, Android, and web after enabling Expo declaration types for a clean checkout, correcting web tab ref typing, and replacing a hydration effect that failed lint. Native device launch was outside this check.
- **Verification.** npm reported eight moderate dependency advisories after Expo’s lint tooling installation. Recheck against the current lockfile with `npm audit`.
