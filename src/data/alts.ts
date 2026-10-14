import type { GuideLink } from "./progression.ts";
import type { Source, SourceId } from "./sources.ts";

export type ResourceCounter = {
  name: string;
  scope: "character" | "server";
  kind: "continuous" | "daily" | "weekly" | "time-budget";
  limit: string;
  cap?: number;
  membershipCap?: number;
  notes?: string;
  guide: GuideLink;
};

// Canonical limits for both Alts and Routine. Weekly allowances are not daily grants.
const counterDefinitions = {
  "odyle-energy": {
    name: "Odyle Energy",
    scope: "character",
    kind: "continuous",
    limit: "15 every 3 hours",
    cap: 560,
    membershipCap: 840,
    notes: "Refilling stops at the cap. Spend energy on useful cube rewards.",
    guide: { to: "/gear", label: "Dungeon rewards" },
  },
  "conquest-rewards": {
    name: "Conquest reward count",
    scope: "character",
    kind: "continuous",
    limit: "1 every 8 hours",
    cap: 21,
    notes: "Open the Odyle Energy Cube before leaving every clear.",
    guide: { to: "/gear", label: "Conquest drops and pity" },
  },
  "transcendence-rewards": {
    name: "Transcendence reward count",
    scope: "character",
    kind: "continuous",
    limit: "1 every 12 hours",
    cap: 14,
    notes: "Open the Odyle Energy Cube before leaving every clear.",
    guide: { to: "/gear", label: "Transcendence and Arcana" },
  },
  "duty-missions": {
    name: "Duty Missions",
    scope: "server",
    kind: "daily",
    limit: "5 completions per day",
    cap: 20,
    notes:
      "Bank up to 20; the shared allowance does not multiply with alts. Unlocks at level 45 and pays 50,000 bound Kina per mission.",
    guide: { to: "/progression", label: "Duty Missions and Kina" },
  },
  nightmare: {
    name: "Nightmare",
    scope: "character",
    kind: "daily",
    limit: "2 per day",
    cap: 14,
    notes:
      "Bank up to 14. An entry is spent only on a clear; Nightmare unlocks at total item level 1,000.",
    guide: { to: "/gear", label: "Nightmare and Clash Runes" },
  },
  "daily-dungeon": {
    name: "Daily Dungeon (Daeva Bio-Research Base)",
    scope: "server",
    kind: "weekly",
    limit: "14 entries each week",
    cap: 14,
    notes:
      "Unlocks at level 30. Spent on entry, not completion. Unused entries are lost at the Wednesday reset; a Challenge Ticket adds 1 entry. Despite the name, this is a weekly pool.",
    guide: { to: "/gear", label: "Enhance Stone sources" },
  },
  "ascension-trial": {
    name: "Ascension Trial",
    scope: "character",
    kind: "weekly",
    limit: "3 each week",
    cap: 3,
    guide: { to: "/gear", label: "Ascension Trial rewards" },
  },
  subjugation: {
    name: "Subjugation tickets",
    scope: "character",
    kind: "weekly",
    limit: "3 each week",
    cap: 3,
    notes:
      "Each entry spends a ticket. Item rewards and the Global menu path are unverified.",
    guide: { to: "/progression", label: "Subjugation gates" },
  },
  exploration: {
    name: "Exploration rewards",
    scope: "character",
    kind: "weekly",
    limit: "7 each week per Expedition dungeon",
    cap: 7,
    notes:
      "The allowance is per dungeon, not one shared total across all Expeditions.",
    guide: { to: "/gear", label: "Exploration drops and pity" },
  },
  raids: {
    name: "Raid attempts",
    scope: "character",
    kind: "weekly",
    limit: "4 attempts per raid each week",
    cap: 4,
    guide: { to: "/gear", label: "Raid gates and drops" },
  },
  "abyss-lower": {
    name: "Lower Abyss time",
    scope: "character",
    kind: "time-budget",
    limit: "7 hours each week; 14 with membership",
    cap: 7,
    membershipCap: 14,
    notes:
      "A Lower Abyss Rift Stone adds 1 hour of Lower Abyss usage time. This does not establish refills for other layers.",
    guide: { to: "/growth", label: "Abyss Rift Stones" },
  },
  "abyss-middle": {
    name: "Middle Abyss time",
    scope: "character",
    kind: "time-budget",
    limit: "7 hours each week; 14 with membership",
    cap: 7,
    membershipCap: 14,
    guide: { to: "/timers/abyss", label: "Abyss timing" },
  },
  "abyss-upper": {
    name: "Upper Abyss time",
    scope: "character",
    kind: "time-budget",
    limit: "7 hours each week",
    cap: 7,
    guide: { to: "/timers/abyss", label: "Abyss timing" },
  },
  "growth-graveyard": {
    name: "Silent Graveyard time",
    scope: "character",
    kind: "time-budget",
    limit: "7 hours each week",
    cap: 7,
    guide: { to: "/growth", label: "Growth dungeon materials" },
  },
  "growth-amphitheater": {
    name: "Fafnite Amphitheater time",
    scope: "character",
    kind: "time-budget",
    limit: "7 hours each week",
    cap: 7,
    guide: { to: "/growth", label: "Growth dungeon materials" },
  },
  "festival-keys": {
    name: "Shugo Festival Reward Keys",
    scope: "server",
    kind: "daily",
    limit:
      "Client data lists 3 per day; daily quantity and reset behaviour remain unverified",
    cap: 12,
    membershipCap: 21,
    notes:
      "Global membership confirms storage caps, not daily allocations. Refill reports conflict. Global client data lists server sharing; that scope has not been confirmed in play.",
    guide: { to: "/festival", label: "Festival keys and rewards" },
  },
  "invasion-keys": {
    name: "Dimensional Invasion Reward Keys",
    scope: "server",
    kind: "daily",
    limit: "1 per day",
    cap: 7,
    notes:
      "Global client data lists server sharing; that scope has not been confirmed in play. Check the in-game counter.",
    guide: { to: "/timers", label: "Dimensional Invasion timing" },
  },
  "morph-energy-character": {
    name: "Odyle Energy (Bound): character recipe",
    scope: "character",
    kind: "weekly",
    limit: "4 crafts each week",
    cap: 4,
    notes:
      "Global client build 0.0.4387.0; check the current recipe before spending. Korean limits differ.",
    guide: { to: "/growth", label: "Substance Morph" },
  },
  "morph-energy-server": {
    name: "Odyle Energy (Bound): server recipe",
    scope: "server",
    kind: "weekly",
    limit: "16 crafts each week",
    cap: 16,
    notes:
      "A separate recipe from the per-character offer. Global client build 0.0.4387.0; check the current recipe before spending.",
    guide: { to: "/growth", label: "Substance Morph" },
  },
  "silver-medals": {
    name: "Silver Medals of Merit: AP shop",
    scope: "character",
    kind: "weekly",
    limit: "10 purchases each week at 10,000 AP per medal",
    cap: 10,
    guide: { to: "/skins", label: "Centurion appearances" },
  },
  "medal-morph": {
    name: "Silver Medal of Merit: Substance Morph",
    scope: "character",
    kind: "weekly",
    limit: "20 crafts each week listed for each recipe",
    cap: 20,
    notes:
      "200 Silver Fragments of Merit (Bound) + 300,000 Kina succeeds at 100%; 20 fragments + 30,000 Kina succeeds at 10%. Whether the recipes share a counter is unverified; do not assume 40 combined crafts.",
    guide: { to: "/growth", label: "Medal recipes" },
  },
  "lesser-abyssal-manastones": {
    name: "Lesser Abyssal Manastones",
    scope: "character",
    kind: "weekly",
    limit: "50 each week at 1,000 AP each",
    cap: 50,
    guide: { to: "/growth", label: "Ordinary and Abyssal stones" },
  },
  "resurrection-server": {
    name: "Resurrection Spiritstones: server stock",
    scope: "server",
    kind: "weekly",
    limit: "10 each week from the membership Wind Breeze shop",
    cap: 10,
    notes: "Membership required; separate from its character stock.",
    guide: { to: "/alts", label: "Membership and shared pools" },
  },
  "resurrection-character": {
    name: "Resurrection Spiritstones: character stock",
    scope: "character",
    kind: "weekly",
    limit: "10 each week from the membership Wind Breeze shop",
    cap: 10,
    notes: "Membership required; separate from its server stock.",
    guide: { to: "/alts", label: "Membership and character pools" },
  },
  "unobtained-cubes": {
    name: "Unobtained cubes: Conquest and Transcendence",
    scope: "server",
    kind: "weekly",
    limit: "10 each week; each skipped cube lowers the remaining count",
    cap: 10,
    notes:
      "At 0, no character on the server can enter either mode until the Wednesday reset.",
    guide: { to: "/alts", label: "Shared cube lockout" },
  },
} satisfies Record<string, ResourceCounter>;

export type CounterId = keyof typeof counterDefinitions;

export const resourceCounters: Record<CounterId, ResourceCounter> =
  counterDefinitions;

export const cubeWarning =
  "Every character must open the Odyle Energy Cube before leaving a Conquest or Transcendence clear. Skipping it lowers the server's weekly unobtained-cube count from 10. At 0, no character on that server can enter either mode until the Wednesday reset. An alt skipping cubes can lock the main out.";

export const refillClockNote =
  "Client data reports daily refills at 16:00 server time and weekly resets on Wednesday at the same time. The EU reset clock remains unresolved; other reports give 07:00 UTC. Trust the in-game countdown rather than treating these times as a verified EU deadline.";

export type SharingEntry = {
  id: string;
  name: string;
  scope: "same-server" | "server-pool" | "character" | "another-server";
  details: string;
};

export const sharingLedger: SharingEntry[] = [
  {
    id: "pets-genus",
    name: "Pets and Genus Insight",
    scope: "same-server",
    details:
      "Pet ownership and Genus Insight are shared within the server. Insight uses the highest progress reached there, and pet levels add up across characters. Pet owned stats and Insight bonuses reach same-server characters. The Korean sharing update is reflected in Global guides, but no Global publisher notice was found.",
  },
  {
    id: "closet",
    name: "Closet appearances",
    scope: "same-server",
    details:
      "Closet appearances are available to every character on the server; weapon skins still require a compatible weapon type. Whether skin owned effects also apply to alts is unverified. Appearance sharing does not establish shared combat bonuses or wing ownership.",
  },
  {
    id: "monolith",
    name: "Empyrean Traces (Monolith)",
    scope: "same-server",
    details:
      "A new character can sync collection progress at the Monolith to the highest progress on the server. This syncs progress, not the feathers themselves.",
  },
  {
    id: "server-storage",
    name: "Server Storage",
    scope: "same-server",
    details:
      "The warehouse separates Character Storage from Server Storage. Every same-server character can use Server Storage, but individual items can forbid it; check each item's restrictions before relying on a transfer.",
  },
  {
    id: "unbound-kina",
    name: "Unbound Kina",
    scope: "same-server",
    details:
      "Conquest cubes pay unbound Kina. Deposit it in Server Storage for the main to withdraw; it can also be used on the Market. This is movable currency, not a promise that all character wallets are one shared balance.",
  },
  {
    id: "membership",
    name: "Quai / Special Quairerk membership",
    scope: "same-server",
    details:
      "Benefits cover characters on the server where membership was bought, including Market and Remote Storage access. Do not assume another server is covered. Festival Key storage rises from 12 to 21; this does not confirm faster key regeneration.",
  },
  {
    id: "server-reward-pools",
    name: "Shared resource pools",
    scope: "server-pool",
    details:
      "Duty Missions, Daily Dungeon entries and the unobtained-cube allowance belong to the server, not each character. Client data also lists Festival and Dimensional Invasion keys as server-wide; their sharing has not been confirmed in play. An alt does not multiply these pools.",
  },
  {
    id: "level-class",
    name: "Level and class",
    scope: "character",
    details:
      "Each character levels independently. Characters cannot change class; trying a different class requires another character.",
  },
  {
    id: "gear",
    name: "Gear and bound items",
    scope: "character",
    details:
      "Equipped gear stays on its character. Soul Bound main equipment cannot be equipped on an alt, and character-bound items stay with the character that claimed them. Server Storage does not override binding restrictions.",
  },
  {
    id: "stigmas",
    name: "Stigmas",
    scope: "character",
    details:
      "Stigma progression belongs to each character; an alt builds its own skills.",
  },
  {
    id: "daevanion",
    name: "Daevanion boards",
    scope: "character",
    details:
      "Each character develops its own boards. Shared pets or Monolith progress do not complete an alt's Daevanion.",
  },
  {
    id: "quests",
    name: "Story and quests",
    scope: "character",
    details:
      "Story and quest progress belong to each character; an alt repeats its own progression work.",
  },
  {
    id: "bound-kina",
    name: "Bound Kina",
    scope: "character",
    details:
      "Exploration and Duty Missions pay bound Kina that stays with the earning character and cannot be stored or sold. Normal progression prices spend bound Kina first. A storable item can be sent to an alt, enhanced with its bound Kina, and returned only if the item's storage restrictions allow it.",
  },
  {
    id: "wings",
    name: "Wings and wing owned effects",
    scope: "character",
    details:
      "Unlocked wings are not shared. Equipped effects and the smaller owned effects belong to the character holding the wings; owned effects stack across that character's pairs and grow from +0 to +10. Closet appearance sharing does not grant an alt the main's wing collection.",
  },
  {
    id: "pantheon-titles",
    name: "Pantheon and titles",
    scope: "character",
    details:
      "Pantheon and titles are character-specific, not shared with alts.",
  },
  {
    id: "abyss-points",
    name: "Abyss Points",
    scope: "character",
    details:
      "Abyss Points belong to each character. The scope and value of the weekly AP earning limit are not established by the counter notes; do not treat an unknown cap as unlimited earning.",
  },
  {
    id: "another-server",
    name: "An alt on another server",
    scope: "another-server",
    details:
      "An alt on another server shares nothing with the main: storage, Kina, collections and same-server progress do not carry over. Cross-server dungeon matchmaking is not progress sharing.",
  },
];

export type AltsSection = {
  id: string;
  title: string;
  items: string[];
  links?: GuideLink[];
};

export const altsSections: AltsSection[] = [
  {
    id: "main-jobs",
    title: "Keep shared pools on the main",
    items: [
      "Use the main for Duty Missions and Daily Dungeon entries, and plan shared key use around the character whose rewards matter most. An alt's extra character counters do not add server allowances.",
      "Keep the main's own gear, Stigmas, Daevanion, wings, Pantheon and titles progressing. Shared appearances and pets do not replace this work.",
    ],
    links: [{ to: "/routine", label: "Daily and weekly reminders" }],
  },
  {
    id: "alt-jobs",
    title: "Use the alt's own counters",
    items: [
      "Spend an alt's Odyle Energy and Conquest or Transcendence reward counts, and use its Nightmare, Ascension Trial, Subjugation, Exploration, raid and time allowances where worthwhile.",
      "An alt that can clear Conquest can earn unbound Kina for the main. Profit depends on actually clearing useful runs and taking cubes; there is no verified Global profitability threshold to promise.",
      "Krao Cave and Urugugu Canyon Exploration cubes cost only 20 Odyle Energy and provide Enhance Stones. Bound resources and equipment restrictions still apply.",
      "Same-server pets, Genus, Closet and Monolith sync give an alt a head start. A different class can also supply a tank or support role for groups.",
    ],
    links: [
      { to: "/gear", label: "Dungeon drops and gear gates" },
      { to: "/growth", label: "Materials and spend priorities" },
    ],
  },
  {
    id: "how-many-alts",
    title: "Start with one alt",
    items: [
      "As advice, start with one alt. Consider two or three only after the first already clears Conquest and you can handle the extra weekly work; more than three is not recommended.",
      "A main plus one alt has been estimated at 15 to 20 hours a week, not a guaranteed play-time requirement. Add another only when its useful rewards justify your time.",
      "Do not use the Korean creator estimate of roughly 1,600 Combat Power as a Global profit gate. Combat Power is also not the total item level used by dungeon unlocks.",
    ],
  },
  {
    id: "factions-and-servers",
    title: "Match faction and server with friends",
    items: [
      "Each Global server has one faction. For regular play with friends, choose the same faction and server; opposite factions do not share a server, legion, open world or economy.",
      "Instanced content supports cross-server play. Global guides describe mixed-faction Expedition, Transcendence and Sanctuary parties, but no Global publisher text confirms that rule; do not extend it to every activity.",
      "Friends, trading, open-world parties, Forces and duels are same-faction only. Party dungeon rooms can offer Same Faction or All. Guides report no way to change an existing character's faction.",
      "Whether one account can hold both factions on different servers remains unresolved. Nothing here assumes cross-server storage, collections or membership benefits.",
    ],
  },
  {
    id: "sharing-limits",
    title: "Appearances are not every owned effect",
    items: [
      "Closet sharing is established for appearances, not for every skin's owned stat effect. Wing ownership is character-specific and separate from Closet availability.",
      "Quna and Centuryroot Token sharing scopes remain unresolved. The weekly AP earning limit, Daeva Pass EXP limit and final-boss kill-cap scopes are also unverified; none is treated as an extra alt allowance.",
    ],
    links: [{ to: "/skins", label: "Appearance sources and ownership" }],
  },
];

export const altsSources: SourceId[] = [
  "metabotSubstanceMorph",
  "metabotManastones",
  "metabotAbyssPoints",
  "metabotLowerAbyssRiftStone",
  "redditBeginnerDps",
  "mmoCodexAlts",
  "gamesGgAlts",
  "officialServers",
  "metabotFactions",
  "game8Factions",
  "metabotChecklist",
  "gameTruthAlts",
  "gamerBlurbShared",
  "ncPetSharing",
  "metabotBeginner",
  "metabotWings",
  "metabotDungeons",
  "metabotContentUnlocks",
  "metabotCurrencies",
  "officialMembership",
  "ownChecks",
];

// Coordinator registers these keys in sources.ts and appends them to footer IDs.
export const counterSourceAdditions = {
  metabotSubstanceMorph: {
    name: "MetaBot Substance Morph recipes",
    covers: "Global Odyle Energy and Silver Medal recipe limits and conditions",
    url: "https://metabot.gg/en/aion-2/conversion",
  },
  metabotManastones: {
    name: "MetaBot Manastone guide",
    covers: "Lesser Abyssal Manastone weekly purchases and AP cost",
    url: "https://metabot.gg/en/aion-2/guides/manastone-guide",
  },
  metabotAbyssPoints: {
    name: "MetaBot Abyss Points inventory",
    covers: "Weekly Silver Medal purchases and AP cost",
    url: "https://metabot.gg/en/aion-2/currencies/abyss-points",
  },
  metabotLowerAbyssRiftStone: {
    name: "MetaBot Lower Abyss Rift Stone",
    covers: "One-hour Lower Abyss usage-time recharge",
    url: "https://metabot.gg/en/aion-2/items/lower-abyss-rift-stone",
  },
  redditBeginnerDps: {
    name: "r/Aion2 beginner progression discussion",
    covers:
      "Membership Resurrection Spiritstone server and character shop stocks",
    url: "https://www.reddit.com/r/Aion2/comments/1x3jc7v/aion_2_beginner_dps_guide_what_to_prioritize_from/",
  },
} satisfies Record<string, Source>;

export const altsSourceAdditions = {
  ...counterSourceAdditions,
  mmoCodexAlts: {
    name: "MMO Codex alt guide",
    covers: "Modest alt-count advice and Korean profit-threshold limitations",
    url: "https://mmo-codex.com/articles/aion-2-alts-guide/",
  },
  gamesGgAlts: {
    name: "GAMES.GG alt guide",
    covers:
      "Role flexibility, other-server isolation and estimated weekly play time",
    url: "https://games.gg/aion-2/guides/alts-explained-should-you-make-an-alt-in-aion-2/",
  },
  officialServers: {
    name: "NCSOFT Global server and matchmaking notice",
    covers: "One faction per server and cross-server instanced content",
    url: "https://store.steampowered.com/news/app/3393110/view/712288224875119598",
  },
  metabotFactions: {
    name: "MetaBot faction guide",
    covers: "Same-faction interaction restrictions and dungeon-room options",
    url: "https://metabot.gg/en/aion-2/guides/elyos-vs-asmodian",
  },
  game8Factions: {
    name: "Game8 faction guide",
    covers: "Faction choice and reported Global mixed-faction dungeon support",
    url: "https://game8.co/games/Aion-2/archives/622434",
  },
} satisfies Record<string, Source>;

export const altsReviewed = "2026-10-12";
