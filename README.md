# AION 2 Field Notes

A sourced, navigable companion site for AION 2 (Global), served at https://aion.corke.dev/. It presents the [aion2-knowledge](https://github.com/tomcorke/aion2-knowledge) base as linkable pages: progression, gear, Daevanion routes, boss timers, routines, alts and events. Every claim keeps its evidence label and source.

## Run locally

Requires Node.js 24 and pnpm.

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## Notes

- Client-only React SPA built with Vite and React Router. Each section has its own URL.
- Hosted on GitHub Pages from the `publish` branch. The build copies `index.html` to `404.html` so deep links load; those responses carry HTTP status 404.
- Planned pages and open decisions live in [docs/scope.md](docs/scope.md). Release steps are in [AGENTS.md](AGENTS.md).
