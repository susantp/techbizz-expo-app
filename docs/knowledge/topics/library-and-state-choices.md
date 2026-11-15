# Library and state choices

Prefer an established, maintained package when it already handles a recurring problem the app needs to solve. Start by checking the repo’s dependencies and patterns. Before adding a package, confirm that its documented behavior fits the feature, that it supports the project’s React and Expo versions and platforms, and that it has an active maintenance history. Declare runtime imports as direct dependencies. Record the choice and the behavior it replaces in the plan.

| Responsibility | Default |
| --- | --- |
| Decode and validate API payloads | **Zod** at the API boundary, with TypeScript output types inferred from schemas. See the [API contract guide](api-contracts-and-typing.md). |
| Fetch, cache, deduplicate, or refresh remote data | **TanStack Query**. Use source-specific query keys and keep validation in the query function. Set freshness, retry, and refetch behavior explicitly for the feature. See the [TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/overview). |
| Share mutable client state across unrelated screens | **Jotai** when shared atoms or derived state simplify the feature. Keep single-screen state in React and navigation state in the router. Keep remote API results owned by the query cache. See the [Jotai docs](https://jotai.org/docs/introduction). |

The Expo portfolio queries own caching, request deduplication, loading, and retry. See the [completed TanStack Query migration](../plans/completed/expo-portfolio-query-migration.md) for the implementation and acceptance results. Add Jotai when a concrete cross-screen client state requirement needs it.
