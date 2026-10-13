# Agent notes

This app is a player-run AION 2 information site at https://aion.corke.dev/, built as a static React site. Its content draws on the owner's personal notes in `E:/working/aion2-knowledge` (repo `tomcorke/aion2-knowledge`) and the guides those notes cite.

## Game content

- Before writing or changing game facts (numbers, schedules, drops), check the notes repo, following `E:/working/aion2-knowledge/AGENTS.md`. Its notes outrank remembered AION 2 knowledge and older artifact copies.
- Every fact the app shows lives in the notes repo first. When filling a gap needs research, record the findings in the notes repo through its own research workflow and rules, then add them to the app, so the two agree.
- Write content as best-effort player notes: plain statements, free of evidence labels and inline source references. Each page ends with a footer naming its sources and its last reviewed date; the Sources page holds the full list and image credits.

## Workflow

Until the initial MVP ships, commit directly to `main`: no feature branches or worktrees for this repo. This overrides the sandbox's branch-and-worktree default.

## Design

Before building or changing any UI, read [docs/design.md](docs/design.md) and follow it. Build pages from the shared components in `src/components/`, so the header, footer and controls stay identical on every page.

## Code

- Each component and page gets its own folder: `src/components/<Name>/` or `src/pages/<Name>/`, holding `<Name>.tsx` and, when it has styles, `<Name>.module.css`. Global CSS is only `src/tokens.css` (all colours and font stacks) and `src/index.css` (element defaults).
- Write CSS nested: hover, focus and child rules sit inside their parent with `&`.
- Space code out: a blank line between logical blocks inside functions and components, never two in a row.
- When ESLint flags function length or cognitive complexity, split the code into a new file rather than suppressing the rule.

ESLint, Stylelint and `test/structure.test.ts` enforce most of this; the lint errors name the fix.

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
