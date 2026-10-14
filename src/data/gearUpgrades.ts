import type { GuideLink } from "./progression.ts";
import type { Source, SourceId } from "./sources.ts";

// Coordinator registers these in sources.ts; metadata stays usable before integration.
export const gearUpgradeSourceAdditions = {
  metabotManastones: {
    name: "MetaBot Manastone guide",
    covers: "Manastone and Soulstone slots, tiers, sources and Abyssal pools",
    url: "https://metabot.gg/en/aion-2/guides/manastone-guide",
  },
  game8Manastones: {
    name: "Game8 Manastone and Soulstone guide",
    covers:
      "Stone slot lists and conflicting Bracelet eligibility and Damage Boost odds",
    url: "https://game8.co/games/Aion-2/archives/615780",
  },
  corpusManastones: {
    name: "Corpus Manastone and Soulstone guide",
    covers: "Fifth engraving slot, roll advice and conflicting reroll reports",
    url: "https://corpus.gg/blog/aion-2/manastones-guide",
  },
  xboxPlayTheostones: {
    name: "XboxPlay Theostone guide",
    covers: "Theostone grades, acquisition and reported combination odds",
    url: "https://xboxplay.games/aion-2/how-to-get-theostones-in-aion-2-76453",
  },
  showGamerTheostones: {
    name: "ShowGamer Theostone guide",
    covers: "Theostone slots, acquisition and destruction on removal",
    url: "https://showgamer.com/en/guides/6367-teokamni-v-aion-2-gde-nayti-kak-ispolzovat-i-uluchshat",
  },
  metabotAulakTheostone: {
    name: "MetaBot Aulak's Roar (Bound)",
    covers: "Named Theostone effect, cooldown and bound variant",
    url: "https://metabot.gg/en/aion-2/items/theostone-aulaks-roar-bound",
  },
  gamesFuzeUpgrades: {
    name: "GamesFuze gear upgrade guide",
    covers: "Extraction, Soul Binding and Transfer losses; region unstated",
    url: "https://gamesfuze.com/guides/aion-2-how-to-upgrade-gear-manastones-theostones-and-soul-binding/",
  },
  gamesFuzeSoulBinding: {
    name: "GamesFuze Soul Binding guide",
    covers:
      "Bind, Sync, Reset, Soul Fuse and the non-inheriting extra effect; region unstated",
    url: "https://gamesfuze.com/guides/aion-2-soul-imprint-soul-binding-guide/",
  },
  metabotTransferStone: {
    name: "MetaBot Transfer Stone (Unique) (Bound)",
    covers:
      "Unique Transfer Stone use; category variants are separately listed",
    url: "https://metabot.gg/en/aion-2/items/transfer-stone-unique-bound",
  },
  metabotTransferWeapon: {
    name: "MetaBot Weapon Transfer Stone (Unique) (Bound)",
    covers: "Weapon-category restriction and non-tradable status",
    url: "https://metabot.gg/en/aion-2/items/transfer-stone-weapon-unique-bound",
  },
  metabotTransferArmor: {
    name: "MetaBot Armor Transfer Stone (Unique) (Bound)",
    covers: "Armor-category restriction and non-tradable status",
    url: "https://metabot.gg/en/aion-2/items/transfer-stone-armor-unique-bound",
  },
  metabotTransferAccessory: {
    name: "MetaBot Accessory Transfer Stone (Unique) (Bound)",
    covers: "Accessory-category restriction and non-tradable status",
    url: "https://metabot.gg/en/aion-2/items/transfer-stone-accessory-unique-bound",
  },
  metabotSyncStone: {
    name: "MetaBot Sync Stone (Unique) (Bound)",
    covers:
      "Sync Stone use and non-tradable status, not its relationship to donor gear",
    url: "https://metabot.gg/en/aion-2/items/sync-stone-unique-bound",
  },
} satisfies Record<string, Source>;

export type GearUpgradeSourceId =
  SourceId | keyof typeof gearUpgradeSourceAdditions;

export const gearUpgradesSources: GearUpgradeSourceId[] = [
  "metabotGear",
  "metabotEnhancement",
  "metabotAbyss",
  "metabotArcana",
  "metabotDaevanion",
  "metabotSpiritmasterPlanner",
  "metabotWings",
  "metabotDungeonPages",
  "ownChecks",
  ...(Object.keys(
    gearUpgradeSourceAdditions,
  ) as (keyof typeof gearUpgradeSourceAdditions)[]),
];

// Global Season 1; gear/level-45-progression.md, reviewed 2026-10-13.
// Older source checks are preserved in the knowledge catalog, not advanced here.
export const gearUpgradesReviewed = "2026-10-13";

export const enhancementGrades = [
  { grade: "Common", cap: 5, safeCap: 5 },
  { grade: "Rare", cap: 5, safeCap: 5 },
  { grade: "Epic", cap: 10, safeCap: 10 },
  { grade: "Unique", cap: 15, safeCap: 10 },
];

export const enhancementRates = [
  { level: 11, successPercent: 65 },
  { level: 12, successPercent: 50 },
  { level: 13, successPercent: 35 },
  { level: 14, successPercent: 25 },
  { level: 15, successPercent: 20 },
];

export const amplificationRates = [
  { level: 1, successPercent: 66 },
  { level: 2, successPercent: 50 },
  { level: 3, successPercent: 33 },
  { level: 4, successPercent: 25 },
  { level: 5, successPercent: 20 },
];

// Stone mechanics: gear/stones.md, reviewed 2026-10-08. Shared with Growth.
export const engravingGrades = [
  { grade: "Common", slots: 1, kina: 500 },
  { grade: "Rare", slots: 2, kina: 1000 },
  { grade: "Epic", slots: 3, kina: 1500 },
  { grade: "Unique", slots: 4, kina: 2000 },
];

export const stoneTiers = [
  {
    id: "lesser",
    name: "Lesser",
    lineGrades: ["Common", "Rare"],
    qualityPercent: [70, 30],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    lineGrades: ["Common", "Rare", "Epic"],
    qualityPercent: [50, 35, 15],
  },
  {
    id: "superior",
    name: "Superior",
    lineGrades: ["Rare", "Epic", "Unique"],
    qualityPercent: [50, 35, 15],
  },
];

export type StoneEngraving = {
  id: "manastone" | "soulstone" | "theostone";
  name: string;
  slots: string[];
  use: string;
  warning?: string;
};

export const stoneEngraving: StoneEngraving[] = [
  {
    id: "manastone",
    name: "Manastone",
    slots: [
      "Weapon",
      "Guard",
      "Helm",
      "Top",
      "Pauldrons",
      "Legs",
      "Shoes",
      "Cloak",
    ],
    use: "Random stat lines. Ordinary stones favor PvE; Abyssal variants keep PvE values but add PvP lines and reduce core-stat odds. Only Superior adds Damage Boost lines; exact Damage Boost odds conflict between guides.",
  },
  {
    id: "soulstone",
    name: "Soulstone",
    slots: ["Necklace", "Earrings", "Rings"],
    use: "The same stat pool and odds as the matching Manastone, but for accessories. Ordinary and Abyssal variants have the same PvE-versus-PvP distinction.",
    warning:
      "Bracelet eligibility is unresolved: the guides disagree. Check the live engraving UI.",
  },
  {
    id: "theostone",
    name: "Theostone",
    slots: ["Weapon", "Guard"],
    use: "A proc effect in a dedicated slot, not a random Manastone stat line. Grades are Rare, Epic and Unique; higher grades strengthen the effect, not the proc chance. Identical stones do not stack.",
    warning:
      "Removing a Theostone destroys it. Bound variants are not tradable; Rare stones are reported tradable, while Epic and Unique are reported account-bound. Check the exact item variant.",
  },
];

export type GearUpgradeSection = {
  id: string;
  title: string;
  items: string[];
  warning?: string;
  links?: GuideLink[];
};

export const gearUpgradeSections: GearUpgradeSection[] = [
  {
    id: "enhancement",
    title: "Ordinary enhancement",
    items: [
      "Spend Enhance Stones and Kina. Every attempt through the safe cap succeeds; the grade table separates that safe range from the maximum level.",
      "Beyond Unique +10, each failure adds 5 percentage points to the next attempt at that level. Ordinary gear never loses levels; failure spends materials.",
      "Enhance weapons before armor. Save late-gear resources for pieces you intend to keep.",
    ],
  },
  {
    id: "clash-runes",
    title: "Clash Runes are different",
    items: [
      "The upgrade to +1 succeeds 100% of the time. Chances fall after +1; exact higher-level rates were not recorded.",
      "Stop at +1 unless you can afford to lose the rune.",
    ],
    warning:
      "A failed Clash Rune upgrade destroys the rune. Ordinary gear's non-destructive failure rule does not apply.",
    links: [{ to: "/growth", label: "Clash Rune sources" }],
  },
  {
    id: "amplification",
    title: "Amplified Enhancement",
    items: [
      "Maxed Unique gear can gain up to five extra levels using Amplify Stones. Piece item levels 36–51 have no Amplified track.",
      "The rate table lists each Amplified step separately from ordinary +11–15. No Amplified failure bonus is established here.",
    ],
    links: [{ to: "/growth", label: "Amplification materials" }],
  },
  {
    id: "extraction",
    title: "Extraction",
    items: ["Up to +10, extraction returns all invested Enhance Stones."],
    warning:
      "Extraction returns Enhance Stones, not Kina. A full refund above +10 is not established.",
  },
  {
    id: "recipes",
    title: "Crafting and upgrade recipes",
    items: [
      "Upgrade recipes carry enhancement, amplification and Soul Binding forward. This is not Enhancement Transfer.",
      "The amulet and belt use Substance Morph: Rare piece level 13 → Epic 36 → Unique 65. Each upgrade is once per character and requires the previous piece at +10.",
    ],
    warning:
      "Recipe retention does not establish that Potential, engraved stones or the extra Soul Fuse effect survive every recipe. Check that recipe's live preview.",
  },
  {
    id: "transfer",
    title: "Enhancement Transfer",
    items: [
      "Enhancement → Transfer moves the Growth enhancement level and Soul Binding stats to another item; it is not a crafting upgrade recipe.",
      "Transfer Stone (Unique) (Bound) permits Unique gear. Its Weapon, Armor and Accessory variants restrict use to that category. These checked variants are bound and not tradable.",
    ],
    warning:
      "Potential, Manastones, Theostones and the extra Soul Fuse effect do not carry over. Exact stone quantities, Kina costs, eligible pairs and the source item's fate are unknown; check the live preview before committing valuable gear.",
  },
  {
    id: "potential",
    title: "Potential",
    items: [
      "Unique gear has four always-successful Potential steps, each costing 100,000 AP plus Potential Stones: 400,000 AP and 10 Potential Stones per item. Potential adds PvP stats.",
      "Save Potential for item levels 86 and 102 that you will keep.",
    ],
  },
  {
    id: "bind",
    title: "Soul Binding: Bind",
    items: [
      "Bind raises four existing extra stats toward 100%; it does not choose a new effect.",
    ],
    warning:
      "Exact Bind costs and whether Bind uses Soul Codex are unknown. Check the live preview; a Soul Codex drop does not establish its use.",
  },
  {
    id: "sync",
    title: "Soul Binding: Sync",
    items: [
      "Sync rerolls one selected effect, leaving the others alone. The replacement is random and can be the same effect again. The % icon shows the possible effects and chances.",
      "Sync Stone (Unique) (Bound) names Soul Binding → Sync as its use and is not tradable.",
    ],
    warning:
      "Guides describe consuming eligible donor gear, including Unique gear. Whether a Sync Stone replaces donor gear or is an additional requirement, exact quantities, Kina costs and eligibility remain unknown. Check the live preview before committing.",
  },
  {
    id: "reset",
    title: "Soul Binding: Reset",
    items: [
      "Reset rerolls all four Soul Binding stats, unlike Sync's single-effect reroll.",
    ],
    warning:
      "Exact Reset costs were not verified. Check the live preview before replacing useful stats.",
  },
  {
    id: "soul-fuse",
    title: "Soul Binding: Soul Fuse",
    items: [
      "At 100% Soul Binding, Soul Fuse adds an extra effect using Philosopher's Stones.",
    ],
    warning:
      "The extra Soul Fuse effect does not inherit through Transfer. Philosopher's Stone acquisition and exact costs are not verified; check the live preview.",
  },
  {
    id: "engraving",
    title: "Engraving",
    items: [
      "Use Enhancement (N) for Manastones, Soulstones and Theostones. Amulets, belts and runes take no stones.",
      "Manastone/Soulstone slots and Kina costs follow gear grade, not stone tier. Soul Binding a Unique piece to 100% reportedly unlocks a fifth slot.",
      "Engraving overwrites existing lines with no undo. Dismantling engraved gear refunds no stones.",
      "Four Theostones of one grade can combine into a higher grade. Reported odds are 11.1% Rare → Epic and 9.1% Epic → Unique; these and the reported 10,000 Kina engrave cost lack official confirmation.",
    ],
    warning:
      "Guides disagree whether re-engraving changes only ticked slots or all lines. Check the live UI before rerolling a useful line; do not assume it is locked. Transfer losses are separate from same-item enhancement.",
    links: [{ to: "/growth", label: "Stone acquisition and limits" }],
  },
  {
    id: "arcana",
    title: "Arcana",
    items: [
      "Five slots open at level 45: Chalice, Parchment, Compass, Bell and Mirror. Common, Rare, Epic and Unique cards add 20, 40, 60 and 80 item level respectively.",
      "Card EXP leveling cannot fail. Duplicates extract into Mysterious Crystals; 5 crystals plus 2,000,000 Kina transmute a chosen Unique card.",
      "Sources include Transcendence, the battle pass, coin shop and attendance. See the tier browser for Transcendence gates and the tier-4 Unique Chalice condition.",
    ],
    links: [
      { to: "/gear", label: "Activity gates and drops" },
      { to: "/growth", label: "Arcana materials" },
    ],
  },
  {
    id: "daevanion",
    title: "Daevanion boards",
    items: [
      "Nezekan, Zikel, Vaizel and Triniel use ordinary Daevanion Crystals. Nodes cost 1–4 points by grade.",
      "Azphel at level 45 uses separate Azphel crystals and has no skill nodes. It is mostly PvP, but includes HP and MP nodes plus Status Effect Chance and Resist nodes without a PvP label.",
      "Spending points raises item level: 1- and 2-point ordinary nodes were checked in game, and Azphel spending also raised item level, including PvP nodes. Do not substitute one item level per node.",
    ],
    warning:
      "The item-level effect of 3- and 4-point nodes and the PvE usefulness of Azphel's Status Effect nodes were not verified.",
    links: [
      { to: "/daevanion", label: "Board routes" },
      { to: "/growth", label: "Crystal sources" },
    ],
  },
  {
    id: "wings",
    title: "Wings",
    items: [
      "Wings have equipped stats and a smaller owned effect, including Flight Power. Owned effects stack across held pairs and grow from +0 to +10; wings are character-specific.",
      "Sources include Sealed Dungeon Featherdown, party dungeons, currency shops and Hidden Cubes. Sealing Wings and Glorious Wings each require 70 Sealed Wing Featherdown plus 10 Pure Odyle at Substance Morph, once per character.",
    ],
    warning:
      "Home-faction Sealed Dungeons provide exactly 140 Featherdown: enough for both wings with none to spare. The bound supply is finite and first-clear rewards do not repeat. Enemy-faction dungeons do not provide Featherdown.",
    links: [{ to: "/growth", label: "Wing materials and finite supply" }],
  },
];
