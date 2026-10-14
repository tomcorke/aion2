# Scope

MVP scope confirmed with the owner. Built so far: the shared header and footer, theme and metal preferences, the home page and `/timers` (the timer dial), `/sources`, stand-in pages for the other sections, and a 404 page. This work completes the eight stand-ins and addresses the remaining Timers and Sources gaps. Home stays unchanged except for shared verified timer corrections.

## Goal

Turn the owner's AION 2 notes (the `aion2-knowledge` repo) and the standalone claude.ai artifacts built from them into one player-run information site that:

- has a consistent header and navigation bar on every page;
- gives every section, tab, and notable anchor its own shareable URL;
- reads as best-effort player notes, no more or less reliable than other guides: plain statements, with each page's sources and reviewed date in its footer;
- adds polish the artifacts lacked: shared design system, working deep links, mobile layout, and light and dark themes.

Region is Global, with EU server times where times matter. Facts come from the `aion2-knowledge` notes.

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

The notes repo also has topics with no artifact yet: factions, character profiles, hidden cubes, Spacetime Rifts, Abyss Corridor, field bosses, legions, Incursion of the Spirits, Mental Focus, Penetration, Spiritmaster Stigmas, Substance Morph, stones, skin sources, Centuryroot Tokens, Abyss Points, HUD currencies, and open questions.

## Sections and specifications

The shell already routes these sections. Detailed specifications live in GitHub issues, with separately approved implementation tickets linked beneath them. This document is the index and scope summary, not a second copy of the specs.

| Path           | Page                                                   | Built from                                        | Spec                                               |
| -------------- | ------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------- |
| `/progression` | Overall item-level route and practical priorities      | Progression Route                                 | [#1](https://github.com/tomcorke/aion2/issues/1)   |
| `/gear`        | Tier drops, pity, upgrades, power outside gear         | Level 45 Gearing, Progression Route gear sections | [#2](https://github.com/tomcorke/aion2/issues/2)   |
| `/daevanion`   | Class routes, diagrams, and point budgets              | Azphel Board Route                                | [#3](https://github.com/tomcorke/aion2/issues/3)   |
| `/timers`      | Existing timer verification and supported gaps         | Level 45 Companion timers tab                     | [#9](https://github.com/tomcorke/aion2/issues/9)   |
| `/routine`     | Manually cleared daily and weekly checklist            | Gearing and Progression routine sections          | [#4](https://github.com/tomcorke/aion2/issues/4)   |
| `/alts`        | Sharing ledger, counters, and main/alt jobs            | Main vs Alts                                      | [#5](https://github.com/tomcorke/aion2/issues/5)   |
| `/growth`      | Searchable materials, uses, sources, and limits        | Notes repo gear, stones and currency topics       | [#6](https://github.com/tomcorke/aion2/issues/6)   |
| `/skins`       | Curated appearances and ownership checklist            | Notes repo skin sources and Festival prices       | [#7](https://github.com/tomcorke/aion2/issues/7)   |
| `/festival`    | Games, rewards, prices, and conditional simulator      | Shugo Festival Datasheet                          | [#8](https://github.com/tomcorke/aion2/issues/8)   |
| `/sources`     | Public sources, image credits, relevant open questions | Notes repo catalog and open questions             | [#10](https://github.com/tomcorke/aion2/issues/10) |

Shareable selections include `/gear/:tier`, `/gear/enhancement`, `/daevanion/:class/:board/:variant` with a points query, `/timers/abyss`, `/skins/:set`, and `/festival/simulator` with its model inputs. These are hash routes, such as `/#/gear/enhancement`; the router owns navigation and in-page scrolling must not replace the route hash.

## Decisions

1. **Content pipeline.** Hand-curate app data from the notes; no Markdown importer or submodule. Every new or corrected game fact goes into the notes first through that repo's workflow. Retain full Daevanion geometry and ordered route data there before importing it into the app. Lazy-load heavy feature data and reuse shared board geometry rather than duplicating it by class.
2. **Source display and freshness.** Use plain best-effort notes without evidence badges or inline citations. Keep meaningful conditions, estimates, and loss warnings beside the advice. Each page's footer names its actual sources, image credit, and reviewed date. A content review against the notes is not a new external source check; copying or rebuilding does not advance source-check dates.
3. **Canonical content.** Progression owns the overall unlock ladder and priorities. Gear owns drop tables, local tier context, pity, and upgrade mechanics. Cross-link full details instead of duplicating tables. Reuse purchase data where Festival and Skins show the same prices.
4. **Browser state.** Keep existing timer state and preferences. Routine ticks and skin ownership use independent browser-local state, not character/server profiles. Ownership and checklist ticks never enter shareable URLs. Search and source/target filters are temporary view state.
5. **Routine resets.** Readers clear daily and weekly groups manually, with confirmation. No clock-driven clearing or live remaining-resource counters. EU clock verification does not block this checklist.
6. **Page interactions.** Progression and Alts are reading guides; Gear uses tier tabs; Growth uses search and target chips; Skins uses a curated catalogue, source filters, and piece ticks. Daevanion shows eight classes, five boards, three PvE variants, the common Azphel route, and a whole-node budget scrubber. Routes assume empty boards; no custom solver or profile import.
7. **Festival model.** Simulate reward openings with starting tokens and a purchase target. Participation income is an explicit opt-in assumption. Show a histogram, text summary, expected total, and sampled target probability. Do not turn openings into verified key counts or calendar completion dates.
8. **Knowledge coverage and gaps.** Fold relevant notes into these themed pages; no generic Topics reader or exhaustive wardrobe. Required facts gate only the slice claiming them. Optional unsupported entries can wait and reader-relevant gaps belong on Sources. Ship no bracketed placeholders or guessed fields.
9. **Tests and delivery.** Use existing routed page/component tests for behaviour and pure tests for calculations/data invariants. Check phones, keyboard access, themes, and metals manually. No new end-to-end framework or standalone speculative control framework. Publication requires a separate user request.

## Remaining verification

- EU daily/weekly reset clocks, the regional server-zone assumption, and unresolved event/boss schedules need focused checks. Correct shared timer data so Home and Timers agree; preserve saved setup and kills. An inconclusive check remains an explicit uncertainty, not a confirmed deadline.
- Retain complete Daevanion node/route data in the notes before the full viewer ships; summary totals alone do not support a purchase diagram.
- Verify required appearance pieces and missing material uses/sources before adding those entries. Unsupported optional entries do not hold up a supported catalogue.
- Festival card/key/package mapping, refill rules, and level-45 applicability of the detailed odds remain limits on the simulator's claims. The conditional opening model does not need those gaps falsely resolved.

## Out of scope for now

Accounts, a backend, per-character/server profiles, automatic knowledge imports, global site search, live inventory/resource tracking, automatic checklist resets, custom Daevanion optimisation, an exhaustive wardrobe, and Korea or Taiwan region data. Local page search and filters are in scope.
