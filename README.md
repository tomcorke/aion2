# AION 2 Field Notes

A player-run information site for AION 2 (Global), served at https://aion.corke.dev/. Best-effort notes on progression, gear, Daevanion boards, boss timers, routines, alts and events, drawn from the owner's [aion2-knowledge](https://github.com/tomcorke/aion2-knowledge) notes and the guides they cite. Each page lists its sources in its footer.

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

- Client-only React SPA built with Vite and React Router, using hash URLs (`/#/timers`). Each section has its own URL.
- Hosted on GitHub Pages from the `publish` branch; `pnpm release` builds and publishes. Pages has no SPA rewrites, hence the hash URLs; `public/404.html` redirects old path links to their hash route.
- Design standards (theme, layout, components) live in [docs/design.md](docs/design.md); every page follows them.
- Planned pages and open decisions live in [docs/scope.md](docs/scope.md). Release notes for agents are in [AGENTS.md](AGENTS.md).
