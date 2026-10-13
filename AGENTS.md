# Agent notes

This app is a player-run AION 2 information site at https://aion.corke.dev/, built as a static React site. Its content draws on the owner's personal notes in `E:/working/aion2-knowledge` (repo `tomcorke/aion2-knowledge`) and the guides those notes cite.

## Game content

- Before writing or changing game facts (numbers, schedules, drops), check the notes repo, following `E:/working/aion2-knowledge/AGENTS.md`. Its notes outrank remembered AION 2 knowledge and older artifact copies.
- Every fact the app shows lives in the notes repo first. When filling a gap needs research, record the findings in the notes repo through its own research workflow and rules, then add them to the app, so the two agree.
- Write content as best-effort player notes: plain statements, free of evidence labels and inline source references. Each page ends with a footer naming its sources and its last reviewed date; the Sources page holds the full list and image credits.

## Workflow

Until the initial MVP ships, commit directly to `main`: no feature branches or worktrees for this repo, apart from the throwaway worktree `pnpm release` makes. This overrides the sandbox's branch-and-worktree default.

## Design

Before building or changing any UI, read [docs/design.md](docs/design.md) and follow it. Build pages from the shared components in `src/components/`, so the header, footer and controls stay identical on every page.

## Code

- `src/` holds only `main.tsx` and folders: `data/` (game facts and site content), `lib/` (pure logic), `hooks/`, `preferences/` (the reader-preferences context and provider), `styles/` (global CSS), `components/`, `pages/`, and `testing/` (test helpers).
- Components live at `src/components/<group>/<Name>/`, grouped by feature (`shell`, `controls`, `trim`, `timers`); start a new group when a feature brings several components. Pages live at `src/pages/<Name>/`. Each folder holds `<Name>.tsx` and, when it has styles, `<Name>.module.css`. Global CSS is only `src/styles/tokens.css` (all colours and font stacks) and `src/styles/global.css` (element defaults).
- Every source file has a test beside it: `foo.ts` and `foo.test.ts`. Tests run in Vitest with Testing Library; render through `renderWithProviders` and freeze time with `freezeClock` from `src/testing/render.tsx`.
- Handle dates and times with `date-fns`, and time zones with `@date-fns/tz`; `src/lib/time.ts` holds the server clock and formatters.
- Import a component's CSS module as `import STYLES from "./<Name>.module.css"`.
- Write CSS nested: hover, focus and child rules sit inside their parent with `&`.
- Space code out: a blank line between logical blocks inside functions and components, never two in a row.
- When ESLint flags function length or cognitive complexity, split the code into a new file rather than suppressing the rule.

ESLint, Stylelint and `test/structure.test.ts` enforce most of this; the lint errors name the fix.

## Scope

`docs/scope.md` holds the intended pages, source material, and open decisions. Read it before planning a feature, and update it when scope changes.

## Development

- Client-only SPA with hash routing (`/#/timers`). React Router owns URLs; every page and tab a user might share gets its own path. Use router links and paths, never hand-written `#` URLs.
- `src/data/sections.ts` drives the router, the header nav, and the home page. Add a section there.
- Hash routing exists because GitHub Pages has no SPA rewrites: a path URL like `/timers` would return 404. `public/404.html` redirects such links to their hash route. In-page anchors cannot use the URL hash; scroll to sections in code instead.
- Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build` before handoff.

## Publishing

`publish` is the GitHub Pages branch: the built site at its root. `public/CNAME` sets `aion.corke.dev`; `public/.nojekyll` disables Jekyll.

Publish only when the user asks, and skip docs-only changes. Push `main`, then run `pnpm release`. It refuses unless `main` is clean and matches `origin/main`, runs the install, handoff checks and build, commits `dist/` to `publish` as `Publish main@<short-sha>` from a temporary worktree, pushes, and waits until https://aion.corke.dev/ serves the new build. A non-zero exit means nothing was published, or the site has not updated yet; report the message.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `tomcorke/aion2`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root, created when needed. See `docs/agents/domain.md`.
