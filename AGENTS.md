This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Shared project knowledge

Scope covers `susantpaudel.com.np`, `techbizz-portfolio`, and this Expo app. Keep cross-project documentation in this repository under `docs/knowledge/`. Start with [the index](docs/knowledge/INDEX.md) and load only the notes relevant to the task. Use the current source to verify dated notes.

## Implementation plans

Write plans for GPT-6 Luna to implement using the plan and the current checkout. Resolve decisions and conflicting requirements before marking a plan ready. Ask a focused question when the source and user instructions leave a material choice open.

- Inspect the current code and name the affected repositories, entry points, and source files. Specify the intended outcome, scope, and existing behavior to preserve.
- Describe the edits in implementation order. Include exact paths, old-to-new mappings, interfaces, callers, and cleanup when those details affect correctness.
- Give reproducible verification commands, test inputs, and expected results. Record known baseline failures and specify how to verify integrations without unintended writes.
- Read the plan once as the implementer and close gaps that would require guessing.
- Keep open plans under `docs/knowledge/plans/ongoing/`. Give each plan a `Status:` line and update it as work progresses. Use **Draft** while decisions are open, **Ready** when the handoff is complete, **In progress** during implementation, or **Blocked** when work cannot continue. Record the blocker and the condition that would unblock it.
- After implementation meets the acceptance criteria, record the completion date and verification results, set the status to **Completed**, and move the same file to `docs/knowledge/plans/completed/`. Update inbound links to the new path and keep reusable reference material in `docs/knowledge/topics/`.
