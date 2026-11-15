# Tech Bizz company portfolio

Source snapshot: main@799eb40, inspected 2026-11-14.

## P0 · Project identity and contracts

- **Production.** The company website is served at `techbizznepal.com`. Its canonical content endpoint is [www.techbizznepal.com/api/content](https://www.techbizznepal.com/api/content).
- **Architecture.** The contact form writes to a configured Google Sheet through a same-origin API endpoint. See [Contact submissions](../topics/contact-submissions.md) for the request, storage, and error contracts.
- **Decision.** See the [completed portfolio content model plan](../plans/completed/portfolio-content-model.md) for the App Router-aligned content model and API implementation.

## P1 · Architecture and workflow

- **Architecture.** Next.js 16.4.2 App Router, React 19.3, Tailwind CSS 4, and Bun 1.4.4. src/app/page.tsx composes homepage sections from src/content/page.ts and leaves under src/content/home/. Shared layout and metadata live in src/content/layout.ts; About data is in src/content/about/page.ts. Typed icon IDs resolve in src/components/content-icons.ts.
- **Architecture.** Layout, pages, and static sections render on the server. ContactUsComponent.tsx and src/components/layout/GoTop.tsx are client components. The layout renders shared navigation, footer, and Vercel Analytics.
- **Architecture.** GET /api/content and GET /api/content/about statically return { layout, page } for their corresponding public pages. /api/hello remains a sample endpoint; /api/googleSheetSubmit preserves the existing contact submission behavior.
- **Workflow.** Run bun install --frozen-lockfile, bun run dev, bun run lint, and bun run build. Read installed Next.js docs per repo AGENTS.md before editing framework APIs. Preserve the TypeScript CLI and JS compiler compatibility aliases when editing the toolchain, as explained in README.md.
- **Workflow.** The README documents Vercel deployment from main and the standalone Docker path. Check the deployed source commit when releasing.

## P2 · Verification

- **Verification.** On 2026-11-14, bun run lint, bun run tsc --noEmit --incremental false, bun run build, and git diff --check passed. Production browser checks passed for metadata, page content and order, image/icon parity, About, and back-to-top behavior.
- **Verification.** Both content APIs matched their TypeScript models exactly; POST returned 405 and unknown content paths returned 404. Contact success, failure, and empty-input cases passed with intercepted mocks; no spreadsheet writes were made.
