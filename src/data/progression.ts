// The Progression guide: the overall item-level ladder and practical priorities.
// Checked against the aion2-knowledge notes (Global, EU) on 2026-10-14.
import type { SourceId } from "./sources.ts";

export type Gate = {
  // Total character item level that opens the content.
  itemLevel: number;
  unlocks: string[];
};

export const gates: Gate[] = [
  {
    itemLevel: 700,
    unlocks: [
      "Krao Cave and Draupnir Conquest (gear item level 54)",
      "Conquest tier 1",
    ],
  },
  {
    itemLevel: 1000,
    unlocks: [
      "Lower Reshanta bases",
      "Ascension Trial Easy",
      "Subjugation (Exploration mode)",
      "Nightmare",
    ],
  },
  {
    itemLevel: 1400,
    unlocks: [
      "Urugugu Canyon and Vakron Sky Island Conquest (gear item level 70)",
      "Vakron Sky Island Exploration",
      "Conquest tier 2",
    ],
  },
  {
    itemLevel: 1500,
    unlocks: ["Ascension Trial Normal", "Subjugation (Conquest mode)"],
  },
  {
    itemLevel: 1600,
    unlocks: [
      "Transcendence tier 1: Deus Research Base and Shattered Arkanis, for Arcana",
    ],
  },
  { itemLevel: 1900, unlocks: ["Transcendence tier 2"] },
  {
    itemLevel: 2000,
    unlocks: ["Ascension Trial Hard", "Subjugation (Transcendence mode)"],
  },
  {
    itemLevel: 2100,
    unlocks: [
      "Fire Temple and Ferocious Horn Den Conquest (gear item level 86)",
      "Ferocious Horn Den Exploration",
      "Conquest tier 3",
    ],
  },
  { itemLevel: 2200, unlocks: ["Transcendence tier 3"] },
  { itemLevel: 2400, unlocks: ["Submerged Life Temple (Transcendence)"] },
  {
    itemLevel: 2500,
    unlocks: [
      "Transcendence tier 4, the only tier with the Unique Chalice",
      "Ascension Trial Extreme",
    ],
  },
  {
    itemLevel: 2800,
    unlocks: [
      "Abyssal Forge: Ludra raid (gear item level up to 102)",
      "Dying Dramata's Nest",
      "Cradle of Nihility",
      "Conquest tier 4",
    ],
  },
  {
    itemLevel: 3000,
    unlocks: ["Hall of Illusion", "Azure Breath Island", "Conquest tier 5"],
  },
  {
    itemLevel: 3500,
    unlocks: [
      "Corroded Decontamination Facility raid",
      "Ascension Trial and Subjugation Hell",
    ],
  },
  { itemLevel: 4300, unlocks: ["Chalice of Muspel Normal"] },
  { itemLevel: 4500, unlocks: ["Chalice of Muspel Advanced"] },
];

export type GuideLink = { to: string; label: string };

export type ProgressionSection = {
  id: string;
  title: string;
  intro?: string;
  items?: string[];
  // Renders the gate table after the items.
  showGates?: boolean;
  links?: GuideLink[];
};

export const progressionSections: ProgressionSection[] = [
  {
    id: "item-level",
    title: "Item level",
    intro:
      "Two numbers share the name. Your total item level, shown on your character, is what opens content. Each gear piece also has its own item level: for example, ordinary monster gear is 41 and dungeon tiers include 54, 70 and 86. Amulets and belts start at item level 13. Compare drops within the same slot.",
    items: [
      "Total item level grows with your gear and its enhancement, with Daevanion points (1- and 2-point nodes have each added 1 item level per point, Azphel included), and with equipped Arcana (Common 20, Rare 40, Epic 60, Unique 80).",
      "Where a new level 45 starts depends on that character's gear and boards, so this guide does not assume a starting number. Check your own total against the ladder below.",
      "Unique gear at item level 102 is the top end on Global for now; Heroic and Mythic gear is not in the game yet.",
    ],
  },
  {
    id: "rules",
    title: "Rules that matter most",
    items: [
      "Always open the Odyle Energy Cube before leaving a Conquest or Transcendence run. Skipping it lowers the server's weekly unobtained-cube count, and at 0 nobody on the server can enter either until the Wednesday reset.",
      "Clear every Sealed Dungeon in your own faction's maps. They pay Daevanion Crystals and the Featherdown both crafted wings need, and their clear rewards do not repeat.",
      "Gates read your total item level; compare upgrades by each piece's item level.",
      "Spend Odyle Energy and reward counts before they reach their caps; a full counter stops refilling.",
      "Enhance your weapon before armor, and save Superior Manastones and Potential for item level 86 and 102 gear you will keep.",
      "Stop Clash Runes at +1 unless you can afford to lose one: a failed upgrade destroys the rune.",
      "Hold Hidden Cube keys until the bigger keyed rewards are useful to you.",
    ],
  },
  {
    id: "before-the-gates",
    title: "Quests and Sealed Dungeons",
    intro:
      "Before the first gate, finish the story, Ascension and regional quests, and clear your faction's Sealed Dungeons.",
    items: [
      "Each regional quest gives a Daevanion Crystal (58 per faction); eight of them, four per faction, also give a Clash Rune Chest.",
      "Each home-faction Sealed Dungeon pays 2 Daevanion Crystals, 2 Sealed Wing Featherdown and 15,000 bound Kina on its first clear (61 per faction). Ruins of the Ancient City of Roah, at level 45, pays 20 Featherdown.",
      "Clearing them all pays about 915,000 bound Kina. A second clear pays nothing.",
      "Sealed Dungeons in the enemy faction's maps, reached through Spacetime Rifts, pay Abyss Points, Enhance Stones and bound Kina instead of crystals and Featherdown.",
    ],
    links: [{ to: "/daevanion", label: "Spend the crystals on Daevanion" }],
  },
  {
    id: "first-gear",
    title: "First gear at 45",
    items: [
      "Ordinary level 45 monsters anywhere can drop the Spectral and Fantasy sets at item level 41: weapons, guards and armor.",
      "The quest Diverging Paths gives the Spiritforged weapon at item level 45.",
      "Named level 45 elites in your home maps, and the field bosses Dartan, Kashapa and Lagta, drop item level 46. Gartua drops 70.",
      "In Lower Reshanta (total 1,000), Watcher and Executor Kaira drop the Kaira set (56) and Kaira Breastplate (62); named elites drop the Fallen Ancient God set (46). Skip the Courage set: at 41 it adds nothing that ordinary monsters do not already drop.",
      "The crafted True Dragon Lord line (62, or 70 on a 25% great success) usually comes alongside the 1,400 Conquest runs. Asmodian crafts use the Star, Dark and Ebony names.",
    ],
    links: [
      { to: "/gear", label: "Drops, pity and upgrades on Gear" },
      { to: "/timers", label: "Field boss timers" },
    ],
  },
  {
    id: "ladder",
    title: "Item-level ladder",
    intro: "The usual route, by total item level:",
    showGates: true,
    links: [{ to: "/gear", label: "Each tier's drop table on Gear" }],
  },
  {
    id: "odyle",
    title: "Odyle Energy and reward counts",
    intro:
      "Conquest and Transcendence runs end in an Odyle Energy Cube; opening it is how you take the run's rewards. These counters refill on their own and stop at a cap, so spend them before they fill.",
    items: [
      "Odyle Energy: 15 every 3 hours, up to 560 (840 with membership). Per character.",
      "Conquest reward count: 1 every 8 hours, up to 21. Transcendence: 1 every 12 hours, up to 14. Exploration: 7 rewards per dungeon each week. All per character.",
      "Krao Cave and Urugugu Canyon Exploration cubes cost only 20 Odyle Energy and pay Enhance Stones, a cheap use for spare energy.",
      "Duty Missions bank up to 20 (5 a day, shared by the server); Nightmare banks up to 14 (2 a day, per character) and spends an entry only on a clear.",
      "The unobtained-cube count starts each week at 10 and is shared by every character on the server. Clearing and leaving without opening the cube lowers it. At 0, no character on that server can enter Conquest or Transcendence until the Wednesday reset.",
    ],
    links: [{ to: "/routine", label: "Track the counters on Routine" }],
  },
  {
    id: "hidden-cubes",
    title: "Hidden Cubes",
    intro:
      "Hidden Cubes sit in the open world. They have nothing to do with the Odyle Energy Cube at the end of a dungeon.",
    items: [
      'Gold cubes open free and give smaller rewards; open them whenever you find one. Red cubes say "Cannot open without a key."',
      "A key raises Silentium from 1–2 to 10, plus two 50% chances of one more, and Soul Crystals from 100 to 1,000. Rare rolls such as wings and skins get double weight.",
      "Eltnen and Morheim cubes scale their rewards with your level, by an amount nobody has published. If Silentium and Soul Crystals do not help you yet, hold your keys until about level 45.",
      "Every character gets nine keys from fixed sources: an early Hero quest, a District quest around level 32–33, and seven tiers of the achievement Who Brought the Chest?. The Season Shop sells 10 more per server at 3,000 Oath Coin each. Duty quests, the pass, the Monolith and attendance add more over time.",
    ],
  },
  {
    id: "shops",
    title: "Shops and Kina",
    items: [
      "Bound Kina, from Sealed Dungeons, Exploration and Duty Missions (50,000 each), stays on the character that earned it. Prices spend it first, so use it for enhancement and NPC shops.",
      "Unbound Kina, from Conquest cubes, can go to Server Storage and the Market.",
      "The Black Cloud Merchant takes only bound Kina. Its stock refreshes free every hour; paid refreshes climb from 500 to 15,000 Kina, 61,500 for all ten.",
      "Abyss Points are per character and spent at Abyss → Trade Shop. Stigma Shards are a better buy than ordinary consumables. Potential Stones cost 25,000 to 100,000 AP across four weekly tiers.",
      "The Nightmare Trade Shop sells Clash Rune Chests for Phantasmal Fragments, earned in Nightmare.",
    ],
    links: [{ to: "/growth", label: "Materials and where they come from" }],
  },
  {
    id: "stigmas",
    title: "Stigmas",
    items: [
      "Stigma slots open at character levels 22, 27, 32 and 37, four in all.",
      "Levelling gives 30 Stigma points by level 45: enough for four Stigmas at rank 5 and one of them at rank 10.",
      "Ranks cost 1 point each up to rank 5, 2 up to 10, 4 up to 15 and 8 up to 20, 75 points in all. Ranks past 20 need Superior Stigma Shards.",
      "Each Stigma switches on a specialization at ranks 5, 10, 15 and 20. These are usually worth more than the extra base damage.",
      "More points come from the Abyss, Nightmare and Shugo Festival shops, achievements and the battle pass. Resetting a Stigma refunds its points but has its own cost.",
    ],
    links: [
      { to: "/gear", label: "Power systems on Gear" },
      { to: "/growth", label: "Stigma materials on Growth" },
    ],
  },
  {
    id: "daevanion",
    title: "Daevanion boards",
    items: [
      "Five boards: Nezekan, Zikel, Vaizel, Triniel, and Azphel, which opens at 45. Nodes cost 1 to 4 points.",
      "Azphel uses its own Azphel crystals, so it never takes points from the other boards. It carries HP and MP nodes as well as PvP ones.",
      "Spending points also raises your total item level.",
      "A reset clears a whole board for Kina, around 20,000 for a board with 70 points spent; you cannot refund a single node.",
    ],
    links: [{ to: "/daevanion", label: "Class routes on Daevanion" }],
  },
  {
    id: "arcana",
    title: "Arcana",
    items: [
      "Five card slots (Chalice, Parchment, Compass, Bell, Mirror), usable from level 45. Each card adds item level by grade: Common 20, Rare 40, Epic 60, Unique 80.",
      "Cards come from Transcendence, the battle pass, the coin shop and attendance. Levelling a card cannot fail.",
      "Duplicates break down into Mysterious Crystals; 5 crystals and 2,000,000 Kina build a chosen Unique card.",
    ],
    links: [{ to: "/gear", label: "Power outside gear on Gear" }],
  },
  {
    id: "pets",
    title: "Pets and Genus",
    items: [
      "Pets and Genus Insight are shared by every character on the server, and pet levels add up across them.",
      "Each pet type (Fera, Natura, Varian, Cogni) has a genus level from 1 to 10, counting every pet of that type you own. Levels grant stat bonuses and open Genus Insight slots 1 to 9.",
      "Insight slots roll stats such as HP, PvE Attack, Boss Attack and Penetration, for 4 Soul Crystals and 1,000 Kina a roll.",
      "When you visit enemy maps through a Spacetime Rift, farm a specific missing pet rather than clearing unrelated monsters.",
    ],
    links: [
      { to: "/gear", label: "Power outside gear on Gear" },
      { to: "/growth", label: "Soul Crystals on Growth" },
    ],
  },
  {
    id: "wings",
    title: "Wings",
    items: [
      "Each pair has an equipped effect and a smaller owned effect. Owned effects stack across every pair you hold and grow from +0 to +10.",
      "Sealing Wings and Glorious Wings each cost 70 Sealed Wing Featherdown and 10 Pure Odyle at Substance Morph, once per character. Your faction's Sealed Dungeons give exactly 140 Featherdown, so missing a single dungeon leaves the second pair out of reach.",
      "Other wings come from party dungeons, currency shops such as the Abyss Trade Shop, and Hidden Cubes.",
      "Unlocked wings stay with the character that unlocked them.",
    ],
    links: [{ to: "/gear", label: "Power outside gear on Gear" }],
  },
  {
    id: "collections",
    title: "Closet and collections",
    items: [
      "Closet appearances are shared by every character on the server. Weapon skins still need a matching weapon type.",
      "A new character can sync its Empyrean Trace (Monolith) progress to the best on the server. The progress syncs, not the feathers.",
      "Pantheon and titles stay with each character.",
    ],
    links: [{ to: "/skins", label: "Skin sources on Skins" }],
  },
  {
    id: "alts",
    title: "Alts",
    items: [
      "Most reward counters belong to each character, so an alt brings its own Odyle Energy, Conquest and Transcendence counts, Nightmare, Ascension Trial, Subjugation, Exploration, raids and Abyss time.",
      "Duty Missions, the daily dungeon and the unobtained-cube count are shared by the server, so leave them to your main. Global client data lists Shugo Festival and Dimensional Invasion keys as server-wide too, but that has not been confirmed in play.",
      "An alt that clears Conquest earns unbound Kina it can pass to the main through Server Storage. Soul Bound gear cannot be equipped on an alt.",
      "An alt that skips cubes costs the main runs, so every character opens its cubes.",
    ],
    links: [{ to: "/alts", label: "What each character shares on Alts" }],
  },
  {
    id: "routine",
    title: "Routine",
    intro:
      "Client data reports daily refills at 16:00 server time and weekly resets on Wednesday at the same time. The EU reset clock is unresolved: other reports give 07:00 UTC. Trust the in-game countdown.",
    items: [
      "Daily: Duty Missions, Nightmare, the daily dungeon (14 entries a week, shared by the server), and spending Odyle Energy before it caps.",
      "Weekly: Exploration rewards (7 per dungeon), Ascension Trial and Subjugation (3 each), raids (4 attempts each) and Abyss time (7 hours per layer).",
    ],
    links: [
      { to: "/routine", label: "Daily and weekly checklist" },
      { to: "/timers", label: "Event times" },
    ],
  },
];

export const progressionSourceIds: SourceId[] = [
  "metabotGear",
  "metabotDungeons",
  "metabotContentUnlocks",
  "gamesFuzeAfter45",
  "metabotEnhancement",
  "metabotChecklist",
  "metabotArcana",
  "metabotDaevanion",
  "metabotSpiritmasterPlanner",
  "metabotAbyss",
  "metabotStigma",
  "metabotWings",
  "metabotHiddenCubes",
  "metabotDungeonPages",
  "metabotCurrencies",
  "metabotBeginner",
  "gameTruthAlts",
  "gamerBlurbShared",
  "ncPetSharing",
  "game8Abyss",
  "wikilyBlackCloud",
  "destructoidClashRunes",
  "gamerBlurbClashRunes",
  "space4GamesRifts",
  "ownChecks",
];

export const progressionReviewed = "2026-10-14";
