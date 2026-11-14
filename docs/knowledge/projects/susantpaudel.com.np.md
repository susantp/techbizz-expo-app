# Personal portfolio

Source snapshot: main@99989fe, inspected 2026-11-14.

## P0 · Project identity

- **Architecture.** The checkout contains Susant Paudel’s personal résumé site. src/app/layout.tsx sets the metadata base to https://www.susantpaudel.com.np.
- **Decision.** See the [completed portfolio content model plan](../plans/completed/portfolio-content-model.md) for the App Router-aligned content model and API implementation.

## P1 · Architecture and workflow

- **Architecture.** Next.js 15.5.9 App Router, React 19.1, Tailwind CSS 4, Bun lockfile, and Biome. src/app/page.tsx renders src/components/Portfolio.tsx from src/content/{layout,page}.ts and the section leaves under src/content/home/.
- **Architecture.** Content leaves own profile, contacts, biography, skills, experience, education, footer, metadata, and viewport data. Icon IDs are resolved in src/components/content-icons.ts.
- **Architecture.** GET /api/content returns the shared { layout, page } model as static JSON. The route layout retains Open Graph and Twitter assembly and derives metadataBase from its content string.
- **Workflow.** Run bun install --frozen-lockfile, bun run dev, bun run lint (Biome), and bun run build. The manifest uses Turbopack for dev and build.

## P2 · Verification

- **Verification.** On 2026-11-14, bun run tsc --noEmit --incremental false, bun run build, and git diff --check passed. bun run lint exits 1 with one existing import-order error in src/lib/utils.ts and two existing type-import warnings; this improves on the six-error, five-warning baseline. New content files lint clean.
- **Verification.** Production browser checks passed for metadata, section and copy order, image and contact URLs, hover-card behavior, and the expected /about 404. Static /api/content JSON matched the TypeScript model exactly; POST returned 405.
