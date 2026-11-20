# Publish Tech Bizz 1.0.0 on Google Play

Status: In progress
Prepared: 2026-11-20
Planning baseline: `techbizz-expo-app` `main@37f448b`
Implementation started: 2026-11-20, Kathmandu time

## Target and scope

Publish the first Tech Bizz Android release on Google Play. Preserve Home, Services, Company, leadership content, and the project inquiry flow. Host the privacy policy on the Tech Bizz Next.js company site. The company portfolio changes are the policy page and its footer link. The personal portfolio and Bazzarify repositories are read-only.

Use `/Users/apache/techbizz/techbizz-expo-app` and `/Users/apache/techbizz/techbizz-portfolio`. Read each applicable `AGENTS.md` before edits. Expo SDK 58, `@techbizz/techbizz-expo-app`, EAS project ID `dc7f37c2-f783-4b5d-a348-bd247f32211a`, display name **Tech Bizz**. Android release package is **`com.techbizz.portfolio`**. Release app version `1.0.0`. EAS increments the Android version code on each production build. Use the existing `production` profile and Bun 1.4.4 to build the Android App Bundle (AAB). Review the [EAS profile reference](https://docs.expo.dev/eas/json/).

The Bazzarify brain’s [mobile route map](/Users/apache/techbizz/bazzarify/brain/CORE/ROUTE_MAP_MOBILE.md) requires native runtime evidence, and its [deployment references](/Users/apache/techbizz/bazzarify/brain/SKILLS/expo-deployment/SKILL.md) split signing, store upload, testing, and promotion. Its [mobile EAS config](/Users/apache/techbizz/bazzarify/src/mobile/eas.json) shows remote versioning and a production channel (`26641cc` was the last commit touching the config). Adapt the remote versioning, environment separation, build provenance, real device testing, and exact-artifact promotion. Tech Bizz’s first release uses manual promotion, with its own identifiers, signing, and approvals. Use EAS Submit to upload successful builds to Play Internal testing. Keep production promotion in Play Console after approval.

## 1. Establish release ownership and credentials

Implementation started from the current checkout. The initial revision is recorded in the release log. Continue with independently actionable app configuration and checks while the policy owner review is outstanding.

- Set the plan **In progress** at kickoff and record operator, candidate revision, intended countries and Play account. Use `git rev-parse HEAD`, `git status --short --branch`, `git diff --stat`, and `git diff --cached --stat`. Preserve unrelated changes, including the existing IDE inspection profile edit. Use a clean checkout of the final release commit for EAS uploads and record the SHA before queueing the build.
- Check `bun --version`, `bunx --bun eas-cli --version`, `bunx --bun eas-cli whoami`, and `bunx --bun eas-cli project:info`. Confirm the existing Tech Bizz project and the account’s build permission. Record the CLI version and use that version on retries. If a remote upload fails specifically with the known Bun request-body/Content-Length mismatch, retry only the failed upload with `bunx eas-cli@<recorded-version> ...` using the same arguments. EAS still builds with Bun. Check whether a build already exists for the candidate before retrying.
- **Android identity.** In Expo `app.json`, change `expo.android.package` from `com.techbizznepal.app` to `com.techbizz.portfolio` before configuring signing or building. Verify the Android package with `bunx --bun expo config --type public --json`. Android treats the two package names as separate apps. The previous USB APK can coexist with the new app. If USB debugging is needed after this change, build and install a new development APK. The USB script already reads the current package from config.
- **Play Console.** In the Tech Bizz account, verify the legal developer identity, completed account verification, operator permissions and eligibility tasks. Open or create the **Tech Bizz** app record for `com.techbizz.portfolio`, English default, app, free. Confirm the package before the first upload. For signing, use an upload key configured for this package in EAS. If Play already has an upload certificate for this package, compare SHA-256 fingerprints and use the matching key. If this is the first upload, provision or explicitly assign an owner-approved key for the new package, enroll in Play App Signing, and record the separate app-signing and upload fingerprints. Keep private material in EAS or an approved secret store. If the account is personal and was created after November 13, 2023, recruit at least 12 closed-test testers who can stay opted in continuously for 14 days before applying for production access. Confirm eligibility in the dashboard. [Play test requirements](https://support.google.com/googleplay/android-developer/answer/14151465).
- Inspect signing with `bunx --bun eas-cli credentials --platform android`. Use the production profile. Coordinate with the account owner before key replacement, revocation, transfers, credential resets, or paid account changes. Continue policy, listing, and preflight work while signing or account access is pending.

### Configure EAS Submit for Internal testing

1. Use the owner-approved Google Cloud project `thamel-mart-com`. The Google Play Developer API (`androidpublisher.googleapis.com`) is enabled and the dedicated service account is `techbizz-play-submit@thamel-mart-com.iam.gserviceaccount.com`.
2. In Play Console → Users and permissions, the service account is **Active** with app-level access for Techbizz (`com.techbizz.portfolio`). It has **View app information (read-only)**, **Release apps to testing tracks**, and the automatically included read-only app quality permission. Account-wide permissions are empty. The release owner handles production and tester lists. [Google Play Developer API setup](https://developers.google.com/android-publisher/getting_started), [Play Console permissions](https://support.google.com/googleplay/android-developer/answer/10019561).
3. The Cloud IAM JSON key is assigned in Expo → Credentials → Android → `com.techbizz.portfolio` → **Google service account key for Expo Submit**. EAS CLI confirmed the assignment and the temporary local copy was removed. Keep future key material outside the repo and out of chat and logs. [Expo Android submission setup](https://docs.expo.dev/submit/android/).
4. In `eas.json`, add `submit.internal.android` with `"track": "internal"` and `"releaseStatus": "completed"`. The `production` build profile still produces the signed AAB. With preflight and credentials verified, run `bunx --bun eas-cli build --platform android --profile production --auto-submit-with-profile=internal`. For a built AAB, run `bunx --bun eas-cli submit --platform android --profile internal --id "$ANDROID_BUILD_ID"`. Record the EAS submission URL and verify the matching version code on Play Internal testing. [Expo auto-submission](https://docs.expo.dev/build/automate-submissions/).

## 2. Close privacy, listing and branding gaps

- **Publish the policy on the company site.** On 2026-11-20 the company domain returned 404 for both `/privacy` and `/privacy-policy`. Its footer has a commented-out placeholder and the Expo app has no privacy entry point. Use approved policy text or draft it for owner approval after the data audit below. Create `src/app/privacy-policy/page.tsx` in the company portfolio following its Next.js conventions, and add the **Privacy policy** link to `/privacy-policy` in `src/components/layout/Footer.tsx`. Run the company repo’s lint, TypeScript and production build. Check the footer and policy page locally, then deploy through the portfolio’s existing release path after approval. Verify `https://www.techbizznepal.com/privacy-policy` returns public HTTPS 200 without authentication. Verify the page’s accessibility and contact links and preserve the existing form and Sheets flow. [Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311).
- Add **Privacy policy** to Company in Expo, outside network-gated content, reachable during an API failure and styled as a secondary action. Put the link in `src/app/(tabs)/company.tsx` using the existing `CompanyAction` pattern and Expo Linking. Use `https://www.techbizznepal.com/privacy-policy` in Expo and the Google Play listing. Preserve the component’s existing layout and query behavior. Provide accessible inline feedback if the link cannot open. Verify the destination from the Android app.
- Audit the installed app’s dependencies, permissions and the merged Android manifest, company and personal API/image hosting request logs, what data stays on device, and what WhatsApp/email handoffs share. If the external company site is linked, distinguish its contact form from the native app’s OS handoffs. Have the owner verify actual processors, retention, rights and contact details before approving the policy and disclosures. Do not infer “no data collected” from the absence of login. Complete Play App content (Data safety, app access, ads, target audience, content rating and additional applicable declarations). Verify prompts against the actual binary and current console requirements.
- Inspect the Android launcher icon, adaptive icon masks, and splash from `app.json` on the candidate. Replace any confirmed starter artwork with owner-approved Tech Bizz assets in the existing asset paths and configuration before cutting the final build. Prepare the Play store icon, feature graphic and screenshots using the dimensions in Play Console. Capture Home, Services, Company and project inquiry from the tested release with real production content and no private inbox details. Keep raw recordings and artifacts outside Git.
- Prepare English store copy and notes based on shipped features. Review text can start with “Open Home, browse Services, then tap Talk about your project to see the email and WhatsApp options. The Company tab includes the CEO profile and Privacy policy. No account is required.” Have the owner approve listing copy, support URL, category, countries and first public release. The app’s company directory and external contact flow may face Play’s limited-functionality review. Explain its actual native navigation and inquiry flow accurately. If Google requests more utility, capture the exact reason and get a product decision before implementing changes. [Play functionality policy](https://support.google.com/googleplay/android-developer/answer/9898783).

## 3. Preflight the final release commit

From the Expo root, verify project credentials and the two exact values in Expo project → Environment variables → production, or use `bunx --bun eas-cli env:list production` without persisting unrelated values. Check the values before starting cloud builds.

```text
EXPO_PUBLIC_COMPANY_ORIGIN=https://www.techbizznepal.com
EXPO_PUBLIC_PERSONAL_ORIGIN=https://www.susantpaudel.com.np
```

Keep the development `.env.local` intact. For local export, use an environment subshell so the explicit HTTPS origins take precedence over local USB settings. Recheck the three producer endpoints. All returned HTTP 200 JSON on 2026-11-20. The company root and personal root must parse with the app’s actual schemas. The company About feed is a producer check with a separate route; the app consumes the two root feeds.

```bash
cd /Users/apache/techbizz/techbizz-expo-app
bun install --frozen-lockfile
bun run lint
bun run typecheck
bunx --bun expo-doctor
git diff --check
(
  export EXPO_NO_DOTENV=1
  export EXPO_PUBLIC_COMPANY_ORIGIN=https://www.techbizznepal.com
  export EXPO_PUBLIC_PERSONAL_ORIGIN=https://www.susantpaudel.com.np
  bunx --bun expo export --platform android
)
bun -e '
import { portfolioSchemas } from "./src/lib/portfolio/model";
for (const [source, url, schema] of [
  ["company", "https://www.techbizznepal.com/api/content", portfolioSchemas.company],
  ["personal", "https://www.susantpaudel.com.np/api/content", portfolioSchemas.personal],
  ["company/about", "https://www.techbizznepal.com/api/content/about", null],
] as const) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(source + " returned " + response.status + " " + response.headers.get("content-type"));
  }
  const body = await response.json();
  if (schema) schema.parse(body);
  else if (!body?.layout || !body?.page) throw new Error("Missing About layout/page");
  console.log(source, response.status, "JSON accepted");
}'
```

Run the checks individually and record each exit status. Resolve launch-relevant Expo Doctor findings from the actual diagnostics. If an API fails, distinguish DNS/TLS, HTTP, JSON and schema failures and reconcile with the public producer before starting public release. Use only public HTTPS origins in production builds.

## 4. Create and test the Android release candidate

```bash
bunx --bun eas-cli build:version:get --platform android --profile production
bunx --bun eas-cli build --platform android --profile production --auto-submit-with-profile=internal
bunx --bun eas-cli build:view "$ANDROID_BUILD_ID"
```

Run the version query and build separately. If the remote version code is unset, initialize it at the build prompt. If Play already has an artifact for this package, compare its highest version code with EAS and reconcile the counter before building. Set `ANDROID_BUILD_ID` to the exact ID returned by EAS before running `build:view`. Confirm the project, Git SHA, app version, version code, AAB, production environment and signing. Record the EAS URL, build image and artifact SHA-256 (`shasum -a 256` on the downloaded AAB). Check the AAB manifest for `com.techbizz.portfolio` and target API 36 or higher. Check 16 KB page support in Play Console App Bundle Explorer before promotion. [Google target API](https://support.google.com/googleplay/android-developer/answer/11926878), [Android page sizes](https://developer.android.com/guide/practices/page-sizes).

- **Android.** In Play Console → Testing → Internal testing, confirm the EAS-submitted version code, add testers, and review bundle warnings. If Play rejects the first API upload or access is pending, use the same signed AAB for a manual Internal testing release and record why. Use the opt-in link with a tester account on a physical Android phone. Use a spare device or confirm before removing an existing USB development installation if Play’s signing certificate prevents installing over it. If closed testing is required, promote the same bundle, record opted-in counts and dates, run the required test, and apply for production access. A first internal upload can be done manually without a Google service account. [Expo manual upload](https://docs.expo.dev/submit/android-manual/).
- **Smoke the Play-installed candidate.** Start from a fresh app install with Metro stopped and USB forwarding unused. Verify first boot, Home company data and artwork, the Services list and its details available in the app, Company with Susant Paudel’s portrait and “CEO, Tech Bizz”, and **Talk about your project** from Home and Services. Verify email and WhatsApp destinations, cancel before sending, and exercise missing-handler feedback where practical. Open Privacy policy and confirm its URL. Background/resume and relaunch. Verify dark mode, larger text, and no clipped navigation or crashes. From a cold offline start verify the retry state, then restore connectivity and confirm recovery. Check that already-loaded data remains visible on a refetch failure where the device permits reproducing it. Verify no contact message or Sheets row was created. Use [device smoke](../../topics/expo-device-smoke-check.md) and [Android USB](../../topics/android-usb-development.md) for debugging; developer builds and simulator results are supplemental. Record device models, OS versions, tester, build number and result per test. If automation is unavailable, do the same steps directly on-device and record who verified them.
- Fix defects on a new candidate commit. Rebuild the AAB, rerun affected checks, and approve the replacement build ID before promotion. Resolve signing mismatches on the same account; do not overwrite an existing remote signing key to get past a prompt. Once a corrected build is installed, distinguish it in the record by Android version code.

## 5. Release on Google Play

- **Play.** After internal/closed acceptance, content declarations, eligibility and owner sign-off for countries and public release, promote the verified AAB/version code to Production. Verify any review and rollout controls before committing the action. On the first production release Google’s staged percentages and managed publishing are unavailable. It can go live in selected countries after review. If approved, record the public listing and verify a clean install with a non-tester account in an eligible region. [Prepare a Play release](https://support.google.com/googleplay/android-developer/answer/9859348), [managed publishing constraints](https://support.google.com/googleplay/android-developer/answer/9859654), [staged rollout rules](https://support.google.com/googleplay/android-developer/answer/6346149).
- Record target countries, review status and IDs, approval and release times, public URLs, the exact released artifact and its checksum, and fresh-install results. For the first 24 hours after launch, check Android vitals, plus live source APIs and inquiry destinations. If a severe crash, failed core flow or privacy error is found, pause subsequent promotion, notify the release owner, and prepare a corrected build from a verified commit with a higher Android version code. For an already live first release, the owner can consider removing availability while the fix goes through review. Keep the API contract compatible with already-installed app versions.

## Acceptance, recovery and closeout

- [ ] Ownership, signing and production environment verified. Confirm Android's `com.techbizz.portfolio` in Expo config, the AAB manifest and the Play record. Privacy and support URLs are public. The Play declarations match the reviewed binary and approved policy.
- [ ] Lint, TS, Expo Doctor, Android export, Git whitespace and live producer checks recorded for the release commit.
- [ ] EAS Submit targets Internal testing for `com.techbizz.portfolio`. Verify the first successful automated submission, or document the manual fallback and the exact step needed to verify automation.
- [ ] The exact AAB passes privacy and project inquiry checks after installation through Play testing on a physical Android phone. Tester and production eligibility are documented.
- [ ] The public Play release is approved, its live listing is verified, and a non-tester account can install and open the app in a selected region. Record the first 24-hour monitoring outcome.
- [ ] For missing access, rejected review, failed build, or external lead time, log date and timezone, command or console action, exact response, outcome of reasonable retry, completed independent checks, owner, and the earliest concrete resume step. Keep **In progress** while independent work is open and move to **Blocked** when no remaining work can advance. A submitted or approved binary does not finish this plan until the public installation checks are done.

On completion, add the completion date, commands, results, the public Play URL and build provenance. Mark **Completed**, move this plan to `docs/knowledge/plans/completed/`, and update the Expo project note and any inbound links. Before each authorized commit, stage explicit task paths and review `git diff --cached --stat` and `git diff --cached --check`. Use separate commits for policy-site changes, Expo release preparation, and Expo closeout. Use `feat: prepare Tech Bizz for Google Play release` for Expo release preparation and `docs: record Tech Bizz Google Play release` for closeout. Keep all `.env.local` files, signing credentials, generated artifacts, and unrelated edits out of commits. Record both relevant repository SHAs and status. Pause at documented approval gates for pushes, store submission/public launch and account actions. The planning request authorizes preparing this plan.

### Release log

| Checkpoint | State | Evidence / next action |
| --- | --- | --- |
| Expo project | Verified at planning | EAS CLI 27.11.0 resolved the expected project ID and `env:list production` showed both expected HTTPS origins on 2026-11-20. Recheck after any configuration change. |
| Source APIs | Verified at planning | On 2026-11-20, the preflight Bun command returned `200 JSON accepted` for all three URLs. Both root feeds passed the app’s Zod schemas and About had both expected keys. Rerun on the release candidate. |
| Baseline | Verified on candidate changes | `bun run lint`, `bun run typecheck`, Android export with production origins, and `git diff --check` passed after Android package and privacy-link changes. Expo Doctor crashed under Bun 1.4.4 with `TypeError: First argument must be an Error object` and emitted bundled source. Retry using the documented EAS CLI runtime fallback pattern or diagnose independently. |
| Privacy | Deployed and verified | Company page and footer link passed site lint and TypeScript production compilation; standalone route returned HTTP 200. Commit `261b03d` is pushed to `origin/main`, and `https://www.techbizznepal.com/privacy-policy` returned HTTP 200 with the expected policy sections on 2026-11-20. Have the owner review the policy wording and test the link on the Android candidate before release. |
| Android | Configured, build pending | Expo config resolves `com.techbizz.portfolio`. EAS Submit key is assigned. `eas.json` now has an Internal testing submission profile. Build the signed production AAB only after the policy and owner-approved branding/listing assets are ready. |
| Candidate revision | In progress | Starting revision `37f448b`; working tree already contained IDE inspection edits and the new plan/project-note edits. Preserve them. |
| EAS Submit | Credentials verified | Google Cloud project `thamel-mart-com` has the Play Developer API and dedicated service account. Brave’s macOS accessibility controls verified the account as Active in Play Console with app-level testing access to `com.techbizz.portfolio`. EAS CLI 27.11.0 confirmed the key assignment for submissions using temporary app config for that identifier. The local key copy was removed. The release candidate and first Internal testing upload remain to be verified. |
| Public release | Open | Google Play production rollout is pending. |
