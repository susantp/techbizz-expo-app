# Tech Bizz Expo app · Company front door

Status: Completed
Completed: 2026-11-15

Prepared 2026-11-15 for GPT-6 Luna. Implementation belongs in the existing checkout at /Users/apache/techbizz/techbizz-expo-app. Read AGENTS.md and this plan in full, check HEAD and git status, preserve unrelated changes, and set this plan to In progress when starting.

## P0 · Scope and current state

Tech Bizz is the app identity and Home is the entry point. Launch with Home, Services, and Company. Susant Paudel appears in Company under Leadership as CEO, Tech Bizz. First release contact actions are Email and WhatsApp. Products, apps developed by Tech Bizz, clients, case studies, and the in-app inquiry form are future scope. Add those sections when their data exists. Ship no empty tabs or placeholder sections.

Inspected Expo deea7e9 (SDK 58, npm, typed routes, web server output), company 30d1e1e, and personal 0212232. Both Next.js checkouts are read-only sources for this implementation. The Expo baseline commands npm run lint and npx --no-install tsc --noEmit passed. Before deployment, the personal endpoint returned HTTP 404 for /api/content. See the release checks below for the verified production endpoints. Both local branches reported one commit ahead of their recorded origin/main. Live availability is a release prerequisite. Implement and verify using the local portfolio servers now. See the [completed API migration](../completed/portfolio-content-model.md).

## P1 · Configuration and transport

1. Add a checked-in .env.example with empty EXPO_PUBLIC_COMPANY_ORIGIN and EXPO_PUBLIC_PERSONAL_ORIGIN. Confirm .env.local is gitignored, adding a targeted ignore entry only if necessary. Developers copy the example to .env.local and set both origins there. Preview and production set the same keys in their build and web server environments. The values are public origins. Never include credentials. No source defaults. Validate using URL: HTTP(S) only, hostname required, no credentials, query, fragment, or path other than /. Require HTTPS for deployed values. Read each key with a literal process.env.EXPO_PUBLIC_… access for Expo client substitution. Use the configured origin of each source for its relative images.
2. Add src/lib/portfolio/config.ts to validate and normalize origins independently and src/lib/portfolio/request.ts for a shared 8-second AbortController deadline covering fetch and JSON parsing, an Accept: application/json header, HTTP success checks, and JSON media type checks (ignore optional charset). Treat absent or invalid config, failed fetch, malformed JSON, and invalid payload as errors for that source only. No credentials and no automatic retries. Native fetches the configured origins directly at /api/content. Web fetches relative /api/portfolio/company and /api/portfolio/personal from the browser after hydration. Keep app.json web.output set to server. Expo CLI reads .env.local locally. Set the public variables when building and also in the deployed web server environment.
3. For web add src/app/api/portfolio/company+api.ts and personal+api.ts plus src/lib/portfolio/web-handler.ts. Each route exports GET only and passes its literal source key to the shared handler. The handler reads the corresponding origin on the server, calls the fixed /api/content path, and returns the parsed JSON on success, with Cache-Control: no-store. Respond with JSON and HTTP 503 for missing/invalid configuration and 502 for upstream errors including timeout. Ignore query parameters. Never accept a caller-supplied destination, forward request headers or credentials, or expose upstream error bodies. Keep these routes private to the app architecture with same-origin browser access and no custom CORS. Existing Next.js APIs and Sheets handlers need no changes. The company /api/content/about currently returns only { heading: "About" } for page, so the Company screen uses the company Home response. Do not request the About API in this release.

## P1 · API fields and request state

Add src/lib/portfolio/model.ts with types and runtime readers for the consumed fields below. Read input as unknown, validate the object, arrays and required strings, then return typed data. Ignore extra fields. Require nonempty strings for displayed content and asset paths; allow empty valid arrays. Required company fields are logo title/path, service and process collections, and whyChooseUs heading/content. Parse the email and phone independently as optional usable values so an invalid action can be hidden without dropping company content. Recognize image paths beginning with a single slash or absolute HTTP(S) URLs; reject other schemes, protocol-relative paths, and backslashes. Company process/service placeholder image URLs are unused. For personal require profile.name. Treat an invalid or missing profile.image as absent. Derive portrait initials from the displayed name if the image is missing or fails to load.

| Feed field | Expo usage |
| --- | --- |
| Company layout.navbar.logo.title and imagePath | Home hero brand and logo |
| Company layout.navbar.headerInfo.email.content | Email using mailto: and a validated single address without query or fragment |
| Company layout.navbar.headerInfo.phone.content | WhatsApp using https://wa.me/ followed by international digits. For the current value +977-9851040576 this is 9779851040576. Strip presentation spaces, parentheses and hyphens, require a leading + and 8–15 digits, then remove +. |
| Company page.whatWeDo.items[] fields slug, title, description, icon | Home first three in API order and Services full list in API order. Use slug as key. Skip the Home preview if empty and show "No services listed yet." on Services. |
| Company page.workProcess.heading and processes[] fields slug, title, icon | Services process section after catalog, in API order. Hide section if empty. |
| Company page.whyChooseUs.heading and content | Home uses the first nonempty paragraph as the intro. Company displays all paragraphs, splitting on blank lines and preserving order. |
| Personal page.profile.name and image | Company Leadership card. Use local UI label "CEO, Tech Bizz" from the requested company role. Do not show the YCOTEK role, personal contacts, or résumé in this release. |

Add src/lib/portfolio/provider.tsx and mount its provider in src/app/_layout.tsx above AppTabs inside the theme. Expose useCompanyContent() and usePersonalContent(enabled: boolean) with { data, status, retry }, where status is idle, loading, ready, or error. Start one company request when the root mounts after hydration. Start personal when Company gains focus for the first time, using Expo Router useFocusEffect with a stable callback that enables the request on first focus. The root provider owns one in-flight promise and one last good value per source for the session. Multiple consumers and focus events share the request. Changing tabs does not cancel it. Abort both on provider teardown and ignore aborted/superseded results. Retry is user-triggered after errors and joins any in-flight call. A refresh failure with existing data leaves that data visible with an inline Retry. With no data, company screens show an accessible loading state followed by "Company information is unavailable." and Retry on failure. The Company screen keeps leadership independent of company data. On personal failure show "Leadership profile is unavailable." and Retry within Leadership. Keep memory only. No new packages needed.

## P1 · Screens and components

1. Keep root routes and existing platform-specific tab architecture. Replace src/app/index.tsx, add src/app/services.tsx and src/app/company.tsx, and remove src/app/explore.tsx. Update src/components/app-tabs.tsx with native triggers index, services, company in that order and text labels Home, Services, Company. Keep the current Home icon. For Services and Company use iOS SF Symbols briefcase and building.2 and Android Material symbols work and business using the SDK 58 Icon sf/md props. Update src/components/app-tabs.web.tsx with /, /services and /company, retain the existing Pressable ref typing, remove Expo Starter/Docs branding, and place a shared tab bar in normal layout flow after a flex:1 TabSlot. Retain theme, splash hiding behavior and StatusBar handling. Remove any visible starter checklist/badges on these screens.
2. Add shared components under src/components/company/ for screen shell, status/retry, service card, contact actions, and leadership card. Keep route files as composition. Home order: logo and Tech Bizz title, intro paragraph, "Explore services" link to /services, "Get in touch" link to /company?section=contact, then a Services preview of the first three titles and descriptions. On Company read section with useLocalSearchParams and scroll to the contact area once it has laid out, including after data loads. Use the same URL on web and native. The contact area is the first section below the header on Company. Services order: heading, all service cards, work process ordered list, "Get in touch" linking to the same Company intent.
3. Company order: Company heading, Contact with Email and WhatsApp, Why choose us, Leadership. Contact actions show only usable values. If neither is usable on a successful company response, show "Contact details are unavailable." Open external actions with Expo Linking.openURL and show "Could not open this link." on rejection. Never call the inquiry endpoint. Leadership shows name, portrait and company role only. Keep brand and screen names visible during request failures.
4. Use React Native ScrollView with automatic content insets and safe-area spacing and existing light/dark theme primitives. Use system typography, a neutral background and orange accents (#C2410C on light, #FDBA74 on dark, with readable text contrast). Use 20 horizontal padding, 24–32 section gap and content width capped at 960. Render one service card per row below 720 and two per row at 720 and above using useWindowDimensions. Every action has a descriptive label, keyboard focus on web, and at least a 48-point touch target. Use expo-image for logo and portrait and keep dimensions stable on failure. Use a local typed icon map with existing expo-symbols SymbolView platform names verified against installed types, using the web symbol names work, shopping_cart, android, design_services, devices, search, analytics, draw, code, speed, and rocket_launch respectively for web-development, e-commerce-solution, android-development, web-designing, responsive-web-design, seo, analysis, designing, development, testing, and launch. Use the same names on Android where supported. For iOS use globe, cart, apps.iphone, paintbrush, display, magnifyingglass, chart.bar, pencil.and.ruler, chevron.left.forwardslash.chevron.right, speedometer, and paperplane in that order. Use a generic briefcase symbol for unknown service IDs and a numbered step marker for any unsupported process icon. Keep decorative icons out of the accessibility tree. Preserve screen copy supplied by the APIs.

## P2 · Acceptance and plan lifecycle

1. From Expo root, run npm run lint, npx --no-install tsc --noEmit, npx --no-install expo export --platform all and git diff --check. Compare against the baseline above. Follow the linked SDK docs for any router or image API you touch. Verify the app builds with no additional dependencies.
2. Follow [Local servers and devices](#local-servers-and-devices) from a cold start. For a physical device use reachable host LAN origins, bind both portfolio servers to `0.0.0.0`, and use reachable HTTPS development endpoints if device policy disallows LAN HTTP. Restart Expo after changing `.env.local`. Record each platform actually exercised.
3. Check cold launch at Home, tabs and direct web route reload at /services and /company, Services counts/order, Contact navigation, and the CEO card with no YCOTEK role. Match real API copy and image origins. Check narrow/wide and light/dark layouts. Confirm native and web Email and WhatsApp destinations without sending messages. Confirm there is no POST to Google Sheets. Confirm Company lazily requests personal content and tab switches reuse the loaded content. Change one local origin to an unreachable port, then restart Expo and verify that source errors independently and the other still works. For recovery, stop and restart an upstream on its configured port and confirm Retry succeeds without restarting Expo. Use intercepts or a local stub on the same machine to verify a 200 HTML response, malformed JSON, unknown icon, and failed image. Do not deploy or push during verification.
4. Record exact commands, results, and any unavailable devices here. The local builds contain the new APIs and control implementation acceptance. After local acceptance passes, mark Completed, record the date, move this file to `plans/completed/`, and update the Expo project note link. Track public API and hosted Expo server checks separately for release, after the portfolio revisions are deployed. Record the failed operation and what will unblock it for any unmet local acceptance item.
5. Commit locally in `techbizz-expo-app` only. After acceptance, include the implementation, `.env.example`, the completed plan, the updated project note and inbound links, and the associated `AGENTS.md` handoff rules. Stage explicit paths, inspect `git diff --cached --stat` and `git diff --cached --check`, commit as `feat: build Tech Bizz Expo front door`, then report `git rev-parse --short HEAD` and remaining `git status --short` entries. Keep `.env.local`, generated files, and unrelated changes out of the commit. If iOS still needs a manual interaction, record the exact resume step and commit the implementation and ongoing plan together as an interim checkpoint. After iOS acceptance, make a follow-up commit with the plan move and final verification. Both portfolio repositories remain read-only sources.

### Local servers and devices

Use three terminals. If the ports are already serving the matching checkouts, reuse them after checking the responses. From `/Users/apache/techbizz/susantpaudel.com.np` (API revision `0212232`):

```sh
bun run build && bun run start --hostname 127.0.0.1 --port 3101
```

From `/Users/apache/techbizz/techbizz-portfolio` (API revision `30d1e1e`):

```sh
bun run build &&
  mkdir -p .next/standalone/public .next/standalone/.next/static &&
  cp -R public/. .next/standalone/public/ &&
  cp -R .next/static/. .next/standalone/.next/static/ &&
  HOSTNAME=127.0.0.1 PORT=3102 node .next/standalone/server.js
```

In `/Users/apache/techbizz/techbizz-expo-app`, set these keys in ignored `.env.local` and preserve any other local settings:

```dotenv
EXPO_PUBLIC_COMPANY_ORIGIN=http://127.0.0.1:3102
EXPO_PUBLIC_PERSONAL_ORIGIN=http://127.0.0.1:3101
```

Run `npm start -- --port 8081` and open `http://127.0.0.1:8081/` in the browser. Verify both sources before opening a device:

```sh
node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
for (const [source, port] of [['company', 3102], ['personal', 3101]]) {
  const upstream = await fetch(`http://127.0.0.1:${port}/api/content`);
  const proxy = await fetch(`http://127.0.0.1:8081/api/portfolio/${source}`);
  for (const response of [upstream, proxy]) {
    assert.equal(response.status, 200, response.url);
    assert.match(response.headers.get('content-type') ?? '', /^application\/json\b/i);
  }
  const payload = await upstream.json();
  assert.deepEqual(Object.keys(payload).sort(), ['layout', 'page']);
  assert.deepEqual(await proxy.json(), payload);
  assert.match(proxy.headers.get('cache-control') ?? '', /no-store/);
  console.log(`${source}: local API and Expo proxy match`);
}
NODE
```

Follow the [Expo device smoke check runbook](../../topics/expo-device-smoke-check.md) with Expo Go for SDK 58 and Metro on port 8081. On this host, Android used `emulator-5554` (AVD `Pixel_3a_API_34_extension_level_7_arm64-v8a`) with reverse mappings for 8081, 3101, and 3102. iOS used the iPhone 17 simulator (iOS 26.0) in Xcode 27 Device Hub. Confirm Home renders real company content before checking Services and Company.

References: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/), [SDK 58 Native tabs](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs/), and [Expo Router API routes](https://docs.expo.dev/router/web/api-routes/).

## Verification log · 2026-11-15

The initial implementation was committed as `ec22779`. The follow-up verified iOS in Device Hub, fixed the navigation buttons, and restored the descriptions on the Home service previews. Production API availability is tracked separately for release.

### Repository checks

- `npm run lint` — passed with no diagnostics.
- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install expo export --platform all` — passed. Exported Android and iOS bundles, web bundle, and both API routes `/api/portfolio/company` and `/api/portfolio/personal`.
- `git diff --check` — passed.
- `node /tmp/techbizz-expo-check.mjs` — passed. Browser verified Home, Services, Company, direct reload of `/services`, Home-to-Services and contact navigation, company-only initial fetch, lazy personal fetch on Company, leadership name/title, no YCOTEK role, contact controls, image presence, and wide/dark rendering.
- Inline Node.js `assert/strict` comparison against the local Next.js production servers — passed for both feeds. Expo proxy JSON deep-equaled its source JSON and returned `Cache-Control: no-store`.
- Inline Node.js POST checks against both Expo API paths — both returned 405. The app and verification did not send any non-GET requests to portfolio APIs or Google Sheets.
- Local stub checks — passed for valid JSON (200), upstream HTML and malformed JSON (both 502); response bodies remained JSON and success responses were no-store. Model checks confirmed unknown icon IDs are retained for UI fallback, while malformed optional email/phone fields are omitted independently. Browser-intercepted failure/recovery checks confirmed one source can fail while the other remains available and that Retry succeeds after the company upstream recovers.
- On follow-up, the Node.js comparison under Local servers and devices passed again with HTTP 200 and exact JSON equality for both feeds. After the UI fixes, reran `npm run lint`, `npx --no-install tsc --noEmit`, `npx --no-install expo export --platform all`, `git diff --check`, and `node /tmp/techbizz-expo-check.mjs`. All passed.

### Native device checks

- Android emulator was present (`emulator-5554`). Its preinstalled Expo Go was SDK 54. Per Expo's SDK mismatch guidance, installed a matching client with `npx expo-go download android 58` (downloaded Expo Go 58.0.5) and `adb install -r Expo-Go-58.0.5.apk`. The downloaded APK was removed from the repository after installation.
- Android Expo Go opened the SDK 58.0.0 project from `exp://127.0.0.1:8081`. Local source origins were connected with `adb reverse tcp:3101 tcp:3101` and `adb reverse tcp:3102 tcp:3102`. Home, Services, and Company rendered; real service data, contact actions, Susant Paudel's portrait, and “CEO, Tech Bizz” rendered. Android opened the configured `mailto:` intent in Gmail Compose and the `https://wa.me/…` URL in Chrome. Both were closed without sending a message.
- iOS Expo Go 58.0.7 on the iPhone 17 simulator (iOS 26.0) opened the SDK 58 project after clicking **Open** in Xcode 27 Device Hub. Verified Home with real content and service previews, Services with API descriptions, and Company with the contact panel and Susant Paudel's portrait and “CEO, Tech Bizz” label. Checked the navigation style fix by tapping **Explore services** and **Get in touch** from Home. Verified the company WhatsApp action opened Safari at `wa.me`. The simulator lacks Mail. A direct `xcrun simctl openurl booted 'mailto:<company-email>'` using the address from the local feed returned OSStatus `-10814`, and the app showed its expected “Could not open this link.” fallback. No messages were sent. Native screenshots were taken with `xcrun simctl io booted screenshot`.
- Android follow-up used `adb shell input tap` and `adb shell uiautomator dump` to confirm both Home action labels appeared and **Explore services** selected the Services tab.

### Release checks after portfolio deployment

- On 2026-11-15, `curl -sSL https://techbizznepal.com/api/content` followed the redirect to `https://www.techbizznepal.com/api/content` and returned HTTP 200 with JSON. The original DNS check used the wrong company hostname.
- After deployment, `https://www.susantpaudel.com.np/api/content` also returned HTTP 200 with JSON.
- Use these HTTPS origins for production API comparisons and web and native smoke checks.

### Platform result

| Target | Result |
| --- | --- |
| Web | Browser route, API, responsive, theme, loading, and retry checks passed. |
| Android | SDK 58 Expo Go on `emulator-5554`; Home, Services, Company, data, portrait, and contact intents passed. |
| iOS | Device Hub smoke check passed on iPhone 17, including the expected fallback when no Mail handler is installed. Sending or composing email on a physical iPhone was not exercised. |
