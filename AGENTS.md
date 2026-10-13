# Agent notes

This app presents the AION 2 knowledge base at `E:/working/aion2-knowledge` (repo `tomcorke/aion2-knowledge`) as a static React site at https://aion.corke.dev/.

## Game facts come from the knowledge base

- Before writing or changing any game claim (numbers, schedules, sources, evidence labels), find it in the knowledge base. Follow `E:/working/aion2-knowledge/AGENTS.md`; its notes and evidence labels outrank remembered AION 2 knowledge and older artifact copies.
- A claim missing from the knowledge base goes there first, through that repo's research workflow, and then into the app. The knowledge base is the single source of truth; the app is a view of it.
- Keep each claim's evidence label and source link next to it in the UI, using the knowledge base's label names.

## Scope

`docs/scope.md` holds the intended pages, source material, and open decisions. Read it before planning a feature, and update it when scope changes.

## Development

- Client-only SPA. React Router owns URLs; every page and tab a user might share gets its own path.
- `src/sections.ts` drives the router, the header nav, and the home page. Add a section there.
- GitHub Pages has no SPA rewrites, so `pnpm build` copies `index.html` to `404.html`. Deep links work but return HTTP 404.
- Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build` before handoff.

## Publishing

`publish` is the GitHub Pages artifact branch: the built site at its root. `public/CNAME` sets `aion.corke.dev`; `public/.nojekyll` disables Jekyll.

1. Release from an updated `main` with a clean worktree (`git status --porcelain` empty). Record `main_commit=$(git rev-parse HEAD)`.
2. Run `pnpm install --frozen-lockfile`, the handoff checks, and `pnpm build`. Confirm `main` still points to `main_commit` and the worktree is still clean.
3. In a temporary worktree on `publish` (orphan for the first release, otherwise from `origin/publish`), replace the contents with `dist/`.
4. Commit as `Publish main@<short-sha>` with body `Source-main-commit: <full-sha>`, push `origin/publish`, then remove the temporary worktree.
5. Verify https://aion.corke.dev/ serves the new asset hash.

Run the release in one shell so recorded commit values stay fixed. Skip publishing docs-only changes.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `tomcorke/aion2`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root, created when needed. See `docs/agents/domain.md`.
