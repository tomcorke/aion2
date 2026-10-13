# Scope

Draft for iteration. Nothing below is built yet beyond the shell: header, navigation, home page, placeholder pages, and a 404 page.

## Goal

Turn the AION 2 knowledge base and the standalone claude.ai artifacts built from it into one site that:

- has a consistent header and navigation bar on every page;
- gives every section, tab, and notable anchor its own shareable URL;
- keeps every claim's evidence label and source, as the knowledge base requires;
- adds polish the artifacts lacked: shared design system, consistent labels, working deep links, mobile layout, and light and dark themes.

Region is Global, with EU server times where times matter. Facts come from `aion2-knowledge`; the app is a view of it.

## Source material

Six artifacts exist today. Each will be rebuilt as a page or merged into one.

| Artifact                  | Last updated | Contents                                                                                                                                                                                          | Interactive parts                                                                                      |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| AION 2 Progression Route  | 2026-10-12   | Ten rules, item-level route 1 to 2,800+, Odyle Energy and cubes, gear and upgrades, bosses, Stigma and macros, Daevanion summary, pets and Genus, shops and Kina, alts, skins, routine, conflicts | Contents rail only                                                                                     |
| AION 2 Level 45 Gearing   | 2026-10-08   | Item-level ladder, activity drop matrix, currency sinks, daily and weekly routine, gear sources, upgrade rules, Arcana, Theostones, Daevanion, wings                                              | Routine checklist (localStorage)                                                                       |
| AION 2 Level 45 Companion | 2026-10-10   | Timers tab plus a copy of the Gearing sheet                                                                                                                                                       | Field boss kill timers, Abyss schedule, event list, faction filter, clock zone selector (localStorage) |
| Azphel Board Route        | 2026-10-11   | Daevanion boards for all eight classes, three route variants per board, skill roles, method notes                                                                                                 | Class picker, board tabs, route picker, points scrubber, SVG board diagram                             |
| AION 2 Main vs Alts       | 2026-10-10   | Sharing scopes (server, server pool, character, other server), counters table, main and alt jobs, faction notes                                                                                   | None                                                                                                   |
| Shugo Festival Datasheet  | 2026-10-05   | Games, keyed token roll, keys, token income                                                                                                                                                       | Monte Carlo reward simulator with histogram                                                            |

The knowledge base also has topics with no artifact yet: factions, character profiles, hidden cubes, Spacetime Rifts, Abyss Corridor, field bosses, legions, Incursion of the Spirits, Mental Focus, Penetration, Spiritmaster Stigmas, Substance Morph, stones, skin sources, Centuryroot Tokens, Abyss Points, HUD currencies, and open questions.

## Proposed sections

The shell already routes these paths. Names and grouping are open for discussion.

| Path           | Page                                              | Built from                                        |
| -------------- | ------------------------------------------------- | ------------------------------------------------- |
| `/progression` | Item-level route and the rules that save the most | Progression Route                                 |
| `/gear`        | Drops by activity, upgrades, power outside gear   | Level 45 Gearing, Progression Route gear sections |
| `/daevanion`   | Board routes by class                             | Azphel Board Route                                |
| `/timers`      | Boss and event timers                             | Level 45 Companion timers tab                     |
| `/routine`     | Daily and weekly checklist                        | Gearing and Progression routine sections          |
| `/alts`        | What carries over between characters              | Main vs Alts                                      |
| `/festival`    | Shugo Festival data and simulator                 | Shugo Festival Datasheet                          |
| `/sources`     | Evidence labels, source catalog, open questions   | Knowledge base catalog and open questions         |

Deep-link candidates: `/daevanion/:class/:board`, `/timers/abyss`, `/gear#enhancement`, `/festival/simulator`.

## Open decisions

1. **How the app gets knowledge-base content.** Options: hand-curated TypeScript data per page; build-time import of the knowledge base Markdown (Git submodule or sibling checkout); or a mix, with structured data (timers, boards, shop prices) as JSON in the knowledge base and prose curated in the app. This decides how a new finding reaches the site.
2. **Evidence labels.** The artifacts use Sourced, Observed, Community, Corroborated, Conflict, and Advice. The knowledge base uses Official, Client-derived, Guide-reported, Community-reported, Estimate, and Unresolved. Proposal: use the knowledge base labels, plus an Observed label for the owner's in-game checks.
3. **Duplication between Progression and Gear.** Both artifacts carry the item-level ladder, gear table, and enhancement rules. Proposal: one canonical home per table, linked from the other page.
4. **Per-browser state.** Timers and checklists store ticks in localStorage today. Keep that, or add per-character profiles?
5. **Board data size.** The Azphel artifact embeds about 850 KB of node and route data. Ship it as a lazily loaded JSON chunk per class.
6. **Knowledge-base topics without an artifact.** Add a browsable "Topics" section rendering each note, or fold them into the themed pages?
7. **Freshness display.** Show each page's reviewed date and client build, taken from the knowledge-base frontmatter.

## Out of scope for now

Accounts, a backend, search beyond the browser's own, and Korea or Taiwan region data.
