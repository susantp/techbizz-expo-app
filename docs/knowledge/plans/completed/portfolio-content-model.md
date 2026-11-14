# Portfolio content model and read-only API

Status: Completed

Implementation started 2026-11-14.

Completed 2026-11-14.

Implementation and acceptance verification are complete. The original baseline and repository revisions are recorded below and in the completion record.

| Pre-change check | Personal portfolio at `99989fe` | Company portfolio at `799eb40` |
| --- | --- | --- |
| `bun run lint` | 6 Biome errors and 5 warnings. Use this baseline for comparison. | Passed |
| `bun run build` | Passed | Passed |

The plan was executed in the existing host checkouts. The known personal lint diagnostics were compared against the six-error, five-warning baseline; the final count is one error and two warnings. All remaining acceptance checks passed. No blocker remains.

Sources inspected: personal portfolio `99989fe`, company portfolio `799eb40`. Paths below are relative to the named repository.

## P0 · Decisions and boundaries

- Implement the migration in `susantpaudel.com.np` and `techbizz-portfolio`. Both sites render and serve the same public content model. The Expo checkout owns this documentation. Expo client integration is outside this implementation.
- The object tree follows App Router filenames. The root keys are `layout` and `page`. A directory is a segment key. A segment's `page` corresponds to its `page.tsx`, and its `layout` corresponds to its `layout.tsx` when present. The company uses `about.page`. The personal About Me section is homepage content at `page.about`.
- Use plain TypeScript data and typed icon IDs. Keep JSX, styles, formatting logic, framework configuration, and request logic in their existing UI or route layers. This is a content migration. Preserve the HTML structure, visible wording, asset paths, links, list order, SEO, and interactions. Use the current source as the authority for literal values.
- Add only the content Route Handlers listed below. Preserve the existing `/api/hello` and `/api/googleSheetSubmit` handlers, the Sheets adapter, dependencies, and lockfiles. Preserve the [contact submission contract](../../topics/contact-submissions.md).

## P1 · Shared file and type conventions

1. Add `src/content/index.ts` with a named `content` export. Import named values and assemble `{ layout, page }` for the personal repo or `{ layout, page, about: { page: aboutPage } }` for the company repo. Root `layout` comes first. The index contains imports and the tree only.
2. Use `src/content/layout.ts` for the root layout object and `src/content/page.ts` to assemble the homepage from the section modules listed below. In the company repo, export `aboutPage` from `src/content/about/page.ts`. Each leaf owns its data and uses named exports. Keep leaf imports pointed directly at other leaves when sharing a value. Leaves never import the index.
3. Preserve the existing field types and optionality except where this plan gives a replacement. Infer the concrete shape from leaf values. Use `as const` for collections containing icon IDs so those IDs remain literal types. Update consumers to take readonly arrays where necessary. Derive each repo's icon union from its content using `typeof` and indexed access. Add `src/components/content-icons.ts` in each repo with a named `contentIcons` map checked with `satisfies Record<ContentIconId, IconType>`, using the type-only `IconType` import from `react-icons`. Derive `ContentIconId` using type-only imports, and import the actual icon components only into the map.
4. Keep metadata and viewport as named exports of each existing Next.js root layout. Use a type-only import of Next.js's `Metadata` and `Viewport` where needed, and keep content values plain. Build the personal site's `new URL(...)` in the route layout from the content string. Import the full tree from server layouts, pages, and Route Handlers only. Pass selected values through existing component calls. Client components receive plain props and stay client components.

### Exact icon unions

In the personal UI map, import `page` as a type from `@/content/page` and use:

```ts
type AboutSection = (typeof page.about.sections)[keyof typeof page.about.sections];
type ContentIconId =
  | (typeof page.profile.contacts)[number]["icon"]
  | AboutSection["icon"]
  | (typeof page.skills.items)[number]["icon"];
```

In the company UI map, import `layout` and `page` as types from their leaf modules and use:

```ts
type HeaderItem = (typeof layout.navbar.headerInfo)[keyof typeof layout.navbar.headerInfo];
type ContentIconId =
  | HeaderItem["icon"]
  | (typeof page.workProcess.processes)[number]["icon"]
  | (typeof page.whatWeDo.items)[number]["icon"];
```

Keep the service content list's icon IDs required so its union contains only IDs. The optional prop belongs to the service item renderer, which handles the existing image branch. In the personal experience leaf, annotate `items` with the existing experience item type so the optional fields remain accessible to its renderer.

## P1 · Personal portfolio

| Source | Destination and shape |
| --- | --- |
| `src/data.ts` → `meta`, plus the root layout's metadata base and viewport | `src/content/layout.ts` → `layout.metadata` with `title`, `description`, and string `metadataBase`, plus `layout.viewport` containing the current viewport object. Keep Open Graph and Twitter assembly in the route layout using the current fields and `content.page.profile.image`. |
| `src/data.ts` → `profile` | `src/content/home/profile.ts` → `page.profile` with `name`, `role`, `image`, and `contacts[{ href, icon }]`. |
| `src/data.ts` → `about`, plus its renderer's section heading | `src/content/home/about.ts` → `page.about = { heading, sections }`. Retain both object keys and their order in `sections`, and preserve each `{ screenTitle, icon, contents }`. |
| `src/data.ts` → `skills`, `experience`, and `education`, plus their renderer headings | `src/content/home/{skills,experience,education}.ts` → `page.skills = { heading, items }`, `page.experience = { heading, items }`, and `page.education = { heading, school, degree }`. Keep all original item and role fields, including optional ones. |
| `Portfolio.tsx` → résumé footer | `src/content/home/footer.ts` → `page.footer = { rightsText }` with `"All rights reserved."`. Render the existing copyright symbol, runtime year, and `profile.name` in the same order. |

- `src/app/page.tsx` passes `content.page` to `<Portfolio page={...} />`. Give `Portfolio` a prop typed from the homepage module via a type-only import. Use `page.about.sections` in the existing `Object.entries` loop, read section headings from the model, and keep `toTitleCase(key)` for the card face. Preserve contact link target/rel rules and image rendering. Use the icon map in place of destructuring component values. Keep UI-only icons for the experience and education decorations in the renderer.
- Personal icon IDs and renderers: `mail` → `LuMail`, `phone` → `LuPhone`, `linkedin` → `SiLinkedin`, `github` → `SiGithub`, `checklist` → `LuListChecks`, `sparkles` → `LuSparkles`, `code` → `LuCode`, `server` → `LuServer`, `cpu` → `LuCpu`, `database` → `LuDatabase`, `cloud` → `LuCloud`, `terminal` → `LuTerminal`, `brain` → `LuBrain`. Import the `Lu*` icons from `react-icons/lu` and the `Si*` icons from `react-icons/si`. Both existing uses of `LuCode` use `code`.
- Switch the root layout and Portfolio away from `@/data`, then delete `src/data.ts`.

## P1 · Company portfolio

| Source | Destination and shape |
| --- | --- |
| Root layout metadata and viewport | `src/content/layout.ts` → `layout.metadata` and `layout.viewport`. Copy the objects verbatim, including the Open Graph URL and `fb:pages`. |
| `site-content.tsx` → `logo`, `headerInfo` | `layout.navbar = { logo, headerInfo }`. Keep logo fields and each contact's `{ content, icon }`; change icon values to IDs. |
| `Footer.tsx`, `GoTop.tsx` | `layout.footer = { rightsText }` using `"All Right Reserved Tech Bizz Pvt.Ltd."` and `layout.backToTop = { label: "Back to top" }`. Keep the year calculation in the footer. |
| `site-content.tsx` → `workProcessComponent`, `whyChooseUs`, `whatWeDo` | `src/content/home/{work-process,why-choose-us,what-we-do}.ts` → `page.workProcess = { heading, processes }`, `page.whyChooseUs = { heading, content }`, `page.whatWeDo = { heading, items }`. Copy all fields, including slugs and image URLs. Keep description line breaks and section order. |
| Home's Contact US heading and `ContactUsComponent.tsx` copy | `src/content/home/contact.ts` → `page.contact = { heading, placeholders: { name, email, subject, detail }, submitLabel, messages: { incomplete, success, error } }`. Copy casing and punctuation exactly from the current page and form handlers. |
| `src/app/about/page.tsx` | `src/content/about/page.ts` → `aboutPage = { heading: "About" }`. Keep the existing `h1` and its class. |

- In the root layout, pass `layout.navbar` as `<Navbar content={...} />`, `layout.footer.rightsText` as `<Footer rightsText={...} />`, and `layout.backToTop.label` as `<GoTop label={...} />`. Navbar still passes the same logo and contact props to its children. Type Logo's existing `title` and `imagePath` props from the navbar logo shape. HeaderInfo resolves icon IDs where it currently renders each icon, with `text-4xl text-orange-500`.
- In the home route, pass the existing heading/list/text props from `content.page` to the three informational sections and pass `<ContactUsComponent content={content.page.contact} />`. Replace contact JSX literals and handler messages with those props. Preserve the current alert trigger, success/error state, textarea behavior, validation, request URL, and payload. In the About route, read the heading from `content.about.page.heading`.
- For company process and services entries, use the existing slug as the icon ID. Map process IDs `analysis` → `BiAnalyse`, `designing` → `MdDesignServices`, `development` → `MdOutlineDeveloperMode`, `testing` → `CgPerformance`, `launch` → `SiOctopusdeploy`. Map service IDs `web-development` → `CgWebsite`, `e-commerce-solution` → `BiCartAlt`, `android-development` → `SiAndroidstudio`, `web-designing` → `SiMaterialdesignicons`, `responsive-web-design` → `DiResponsive`, `seo` → `SiGoogleanalytics`. Map navbar IDs `whatsapp` → `IoLogoWhatsapp` and `email` → `MdEmail`. Keep the current library subpath for every import.
- Process and service renderers use `text-8xl text-orange-500` when displaying mapped icons. Use a typed optional `icon` prop for the service item renderer and test its presence to select the current icon or image branch. Every existing item keeps its icon ID. Retain the same image props and alt text in the fallback.
- Switch the home route and Navbar away from `@/content/site-content`, then delete `src/content/site-content.tsx`. Update the company README's structure and content-editing pointers to the new location.

## P1 · Read-only content API

Use a fixed Route Handler for each existing rendered page. The response contains the shared layout and only that page's data. The public page and handler both import the same content tree from `@/content`. Rendering continues to read the module directly.

| Repository | Public endpoint | New file | Exact JSON response |
| --- | --- | --- | --- |
| Both portfolios | `GET /api/content` | `src/app/api/content/route.ts` | `{ layout: content.layout, page: content.page }` |
| Company portfolio | `GET /api/content/about` | `src/app/api/content/about/route.ts` | `{ layout: content.layout, page: content.about.page }` |

- In each new file, import `{ content }` from `@/content` and export a synchronous `GET()` that returns `Response.json(...)` with the exact object in the table. Export `const dynamic = "force-static"` at module scope. These values are built with the deployment from checked-in modules. Use Next.js's default HTTP cache headers and method handling.
- Successful responses are HTTP 200 with JSON. Return raw model values, including string icon IDs, source asset paths, plain metadata fields and viewport, and optional fields only where they exist. The personal site's metadata base stays a string in JSON. The route layout still derives Open Graph and Twitter metadata at render time. Do not add a response envelope, normalize asset URLs, or calculate the copyright year in the API.
- The handlers serve only the public content branches in the table. They take no route parameters or query options and need no credentials, database, or other runtime service. Use no custom CORS headers in this release. The personal site has no About handler. Unknown content paths use Next.js's usual 404 and unimplemented write methods use its usual 405.
- Document the endpoint paths and the `{ layout, page }` response in the company README alongside the new content-editing pointers. Include the endpoints in the two knowledge-base project notes when implementation is verified.

References: [Next.js 15 Route Handlers](https://nextjs.org/docs/15/app/api-reference/file-conventions/route) and [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route). For the company version, also read the installed `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`.

## P2 · Implementation order and acceptance

1. Check `git status --short` and HEAD in both portfolio roots and preserve unrelated working-tree changes. Reuse the recorded baseline for those revisions. Read the company repo's `AGENTS.md` and referenced local Next.js docs. Work through the personal repo first, then the company repo. In each one, add leaves and the route tree, connect the website consumers, add the listed GET handlers, and remove the superseded module after the last import is gone.
2. Run `bun run tsc --noEmit --incremental false`, `bun run lint`, `bun run build`, and `git diff --check` in each repo. The earlier personal baseline had six Biome errors and five warnings. Compare diagnostics against the baseline captured for this run. Require new files to pass and avoid unrelated formatting changes. Company lint, TypeScript, and both builds should pass. Report any environment blocker and the exact command that encountered it.
3. Serve the personal production build with `bun run start --port 3101`. In the company repo, copy `public` into `.next/standalone/public` and `.next/static` into `.next/standalone/.next/static`, then run `HOSTNAME=127.0.0.1 PORT=3102 node .next/standalone/server.js`. If either port is in use, choose a free local port and use it consistently in verification. Inspect personal `/`, company `/`, and company `/about`. Compare with the source or a baseline capture. Check page title, description, viewport and social metadata, section order and copy, contact URLs, logo/image sources, icon parity, and footer text. Spot-check personal hover cards and company back-to-top behavior. Keep personal `/about` absent.
4. Use the browser procedure below to intercept the company browser request to `POST /api/googleSheetSubmit`. Enter four distinct test values and confirm the JSON body contains exactly `name`, `email`, `subject`, and `detail` with those values. Mock 200 with `{"data":{}}` and 500 with `{"data":{"message":"Unable to submit your message."}}` and check the existing success and failure messages. Test an empty field and confirm it triggers the existing alert without a request. Route interception keeps the test from writing to a live spreadsheet.
5. With both production servers running, run the checks below from their corresponding repo roots. These compare each entire parsed JSON response against the same model the pages use. The expected round-trip through JSON accounts for omitted optional fields. Both commands must exit 0.

   From the personal repo:

   ```sh
   bun -e 'import assert from "node:assert/strict"; import { content } from "./src/content"; const base = "http://127.0.0.1:3101/api/content"; const res = await fetch(base); assert.equal(res.status, 200); assert.match(res.headers.get("content-type") ?? "", /^application\/json\b/); assert.deepEqual(await res.json(), JSON.parse(JSON.stringify({ layout: content.layout, page: content.page }))); assert.equal((await fetch(base + "/about")).status, 404); assert.equal((await fetch(base, { method: "POST" })).status, 405);'
   ```

   From the company repo:

   ```sh
   bun -e 'import assert from "node:assert/strict"; import { content } from "./src/content"; const base = "http://127.0.0.1:3102/api/content"; for (const [path, page] of [["", content.page], ["/about", content.about.page]] as const) { const res = await fetch(base + path); assert.equal(res.status, 200); assert.match(res.headers.get("content-type") ?? "", /^application\/json\b/); assert.deepEqual(await res.json(), JSON.parse(JSON.stringify({ layout: content.layout, page }))); assert.equal((await fetch(base + path, { method: "POST" })).status, 405); } assert.equal((await fetch(base + "/missing")).status, 404);'
   ```

6. Search both source trees for the removed import paths and confirm the old modules are gone. Confirm the existing company `hello` and `googleSheetSubmit` handlers and the Sheets adapter have no diff. Record checks and remaining gaps in this note and update the two project notes to point to the implemented content entry points. Completed verification requires reporting the checks actually run.


### Browser verification on this host

The readiness check launched Chromium using the cached Playwright Core 1.59.1 package. In a temporary Node ESM script, import `{ chromium }` from `/Users/apache/.bun/install/cache/playwright-core@1.59.1@@@1/index.mjs`, launch with `await chromium.launch()`, and close the browser in a `finally` block. Run it with `node /absolute/path/to/script.mjs`. If that cache is missing, use an available browser automation tool with request interception or provision Playwright outside the portfolios. Leave their manifests and lockfiles as they are.

For the company form, open a fresh page for each response case. Before navigation, register `page.route("**/api/googleSheetSubmit", handler)` and have the handler assert `route.request().method() === "POST"`, capture `postDataJSON()`, and call `route.fulfill({ status, json })` with the mock in step 4. Never call `route.continue()` in this test. Fill the form using `#username`, `#email`, `#subject`, and `#detail`. Use `Test Name`, `test@example.com`, `Test Subject`, and `Test Detail` and click the `Submit` button. Assert the full captured payload and wait for `Thank you.` or `Something Went wrong.` as appropriate. In a third fresh page register the same interception and a dialog handler, leave the form empty, click Submit, dismiss the dialog, and verify its text is `Please fill form properly.` and no submission was captured.

Use the same browser to inspect the three rendered routes and exercise the hover and scroll interactions in step 3. Record any remaining gaps with the command and observed error.


## Completion record · 2026-11-14

Both portfolio migrations and read-only APIs are implemented. The sites render their routes from the planned TypeScript content trees, icon IDs resolve through typed UI maps, and the former JSX/central data modules are removed. The company README and both Expo project notes point to the completed content model and document its API endpoints. The existing Google Sheets route, Sheets adapter, sample hello route, and dependency manifests have no diff.

### Verification results

- Personal portfolio at HEAD 99989fe: bun run tsc --noEmit --incremental false passed; bun run build passed on Next.js 15.5.9; git diff --check passed. bun run lint exits 1 with one existing import-order error in src/lib/utils.ts and two existing type-import warnings. Its six-error, five-warning baseline improved to one error and two warnings; new content modules pass Biome.
- Company portfolio at HEAD 799eb40: bun run lint, bun run tsc --noEmit --incremental false, bun run build, and git diff --check passed on Next.js 16.4.2.
- Started the personal production app with bun run start --port 3101. Staged company standalone assets with cp -R public .next/standalone/public && mkdir -p .next/standalone/.next && cp -R .next/static .next/standalone/.next/static, then ran HOSTNAME=127.0.0.1 PORT=3102 node .next/standalone/server.js.
- API equality checks passed from each repo using the acceptance scripts in this plan: status 200 and JSON content type; full parsed response equals JSON.parse(JSON.stringify({ layout, page })) from that repo's imported content model; POST returns 405; personal /api/content/about and company /api/content/missing return 404.
- node /tmp/techbizz-portfolio-browser-check.mjs passed. It checked personal and company page metadata, copy and section order, links, image paths, icon presence, personal hover-card transform, company About heading, and back-to-top interaction. It intercepted all company form requests and asserted the exact four-field JSON payload for mocked 200 and 500 results; empty submission displayed the existing alert and sent no request. No live spreadsheet row was created.
- Repository searches found no imports of @/data or @/content/site-content; both superseded files are absent. Existing company API handlers and src/lib/google-sheets.ts are unchanged.

### Remaining verification gaps

None for the acceptance criteria in this plan. Personal lint remains nonzero due to its pre-existing src/lib/utils.ts import-order diagnostic; the total diagnostics are below the recorded baseline. Deployment and live spreadsheet writes were intentionally not part of this plan.
