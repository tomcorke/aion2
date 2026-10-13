# Design standards

These rules set how every page of the site looks and behaves. They record the chosen prototype direction; follow them when building or changing UI, and update this file when a design decision changes.

Prototypes live on the claude.ai canvas "AION 2 Site Prototypes" (https://claude.ai/artifact/U91MaTXKogK8jViqef1dki, private to the owner). The chosen boards are **B2 · Wings** for the home page and timers, and the **Level 3 pages** (Alts, Gear, Growth materials, Skins, Daevanion) for everything else. Other boards are kept as reference only.

## Principles

- **Best-effort player notes.** Write plain statements. Name sources once, in the page footer; leave evidence labels and inline citations out of the page body.
- **Metal is trim, never fill.** Gold or silver appears in headings, numbers, hairlines, small markers, rings and progress fills. Surfaces stay plain.
- **Open layouts.** Use hairline-separated rows, lists and tables. Reserve rounded surfaces for containers that float (popovers, sheets, the dial). Avoid grids of bordered boxes.
- **Each page gets the layout its content needs.** The dial and spokes belong to the home page and timers only.

## Theme

Two modes, each with a default metal the reader can swap.

| Token  | Night (default gold)    | Day (default silver) |
| ------ | ----------------------- | -------------------- |
| ground | `#0c1018`               | `#f5f6f8`            |
| ink    | `#ece9e1`               | `#1c2230`            |
| muted  | `#a3aab9`               | `#545d6d`            |
| line   | `rgba(255,255,255,.09)` | `rgba(20,30,50,.1)`  |

| Accent | Night     | Day       |
| ------ | --------- | --------- |
| gold   | `#e6bb5c` | `#8a610f` |
| silver | `#d5dbe4` | `#465061` |

- Night defaults to gold and day to silver. The metal toggle (two small dots, gold and silver) sits beside the theme button and is smaller than it. Both choices persist per browser.
- Gilded gradient text is limited to the wordmark, the page title and hero numbers such as the reset countdown.
- Boss orbs use a radial metal gradient; fixed-timer markers are rings in the accent.
- Define tokens as CSS custom properties on the root element, switched by `data-theme` and `data-metal` attributes.

## Typography

| Use                              | Face                      |
| -------------------------------- | ------------------------- |
| Wordmark "AION 2"                | Cinzel 700, letter-spaced |
| Page titles and section headings | Marcellus                 |
| Body text, labels, controls      | Source Sans 3             |
| Times, countdowns, item levels   | JetBrains Mono            |

## Page anatomy

- **Header**, 64px: wordmark left, section nav, then (on pages with times) the live server clock, the metal toggle and the theme button. Nav links stretch to the header's bottom border; the current section has a 2px accent underline sitting on that border.
- **Hero band**: a press-kit image fading into the page (170–230px on desktop, 130–170px on phones) with the page title and a one-line lede over its lower edge. No slogans, and no credit text on the image.
- **Body**: content in hairline rows, tables and short sections, with 56px side gutters on desktop and 16px on phones. Separate major sections with a hairline rule carrying a small centre diamond; mark list items with small accent diamonds.
- **Footer**: a hairline rule, then one paragraph naming the page's sources and image credits, the reviewed date, and an "All sources" link.

## Home page and timers: the dial

- A 300px dial counts down to the daily reset with an accent arc, shows the reset time in the chosen zone, and shows the live server clock.
- Fixed timers (weekly reset, Spacetime Rift, Dimensional Invasion, Artifact Siege) stack in a column left of the dial as rings. Bosses stack on the right as metal orbs, biggest gear item level first, orb size scaled by gear item level. A straight spoke joins each to the dial.
- A toolbar under the dial holds: Times in Server · Local · UTC, group chips (Fixed, Lower Reshanta, Field bosses), the gear item-level filter (All, 46+, 56+, 70+, 86), and Edit timers.
- Readers can hide, reorder and filter timers. Field bosses start untimed until the reader marks a kill. These choices persist per browser.
- On phones the dial shrinks to the top left and timers hang off a vertical spine below it, one row each.

## Times

- Lead with the countdown ("in 3h 12m") and put the clock time second.
- The zone preference offers Server, Local and UTC (UTC covers GMT). It defaults to Server and persists per browser.
- Format and compute every time with `date-fns` and an IANA zone from `@date-fns/tz` (helpers in `src/lib/time.ts`), so daylight saving is handled; avoid hand-written offset arithmetic.
- Keep the server time zone in one constant per region. Europe is currently `Europe/Berlin`; the region's true server clock is an open question in the notes repo, so expect to change that constant.

## Page patterns

| Page             | Layout                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alts             | Two-column ledger, shared on the server against each character, with limits; then the cube-count warning, how many alts, and what never carries over |
| Gear             | Item-level tier tabs, a gate track marking open and next gates, a table of where that tier's upgrades drop, pity counts, the enhancement ladder      |
| Growth materials | Search and "what it grows" chips over a table (item, grows, from, limit), with caps and spend order alongside                                        |
| Skins            | Search and source chips; a list of sets with progress; the selected set's piece checklist and where it comes from                                    |
| Daevanion        | Class tabs; three route totals; points per board as bars; core, defensive and utility skills; the shared Azphel route                                |

## Phones

- Stack content in one column. Filter chips and tabs scroll sideways rather than wrap.
- Tap targets are at least 40px. The metal toggle is the deliberate exception at 24px.
- Desktop side columns move below the main content.

## Accessibility

- Use real `button`, `a` and `input` elements. Toggles carry `aria-pressed`, tabs `role="tab"` and `aria-selected`, the current nav item `aria-current="page"`.
- Body text meets 4.5:1 contrast in both modes and both metals. Colours that must be told apart also differ in lightness.
- Decorative images and SVG get empty `alt` or `aria-hidden="true"`.

## React components

Build every page from shared components in `src/components/`; never copy header, footer or control markup into a page. At minimum:

| Component                                  | Role                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| `SiteHeader`                               | Wordmark, section nav from `sections.ts`, clock and toggles               |
| `SiteFooter`                               | Rule, sources paragraph, reviewed date; takes the page's sources as props |
| `PageHero`                                 | Image band with title and lede                                            |
| `ThemeToggle`, `MetalToggle`, `ZoneSwitch` | Reader preferences                                                        |
| `ServerClock`                              | Live server time                                                          |
| `Tabs`, `FilterChips`, `SearchField`       | Page controls                                                             |
| `Rule`, `Diamond`, `Orb`, `ProgressBar`    | Trim and markers                                                          |
| `TimerDial`, `TimerWings`, `TimerSpine`    | Home and timers                                                           |

Hold site-wide reader preferences (theme, metal per theme, zone, faction) in one context backed by `localStorage`. State that belongs to one feature, such as the timer setup and marked kills, uses `useStoredState` in that feature's component.

## Content and images

- Every game fact comes from the notes repo (`E:/working/aion2-knowledge`). When a page needs a fact the notes lack, research it into the notes repo first, following that repo's own rules, then use it here. Prototypes mark gaps with bracketed text; shipped pages carry none.
- Images come from the AION 2 press kit on IGDB. Credit them in the page footer and on `/sources`. Leave the official AION 2 logo out so the site never passes as official.
