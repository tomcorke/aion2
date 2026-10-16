import { expect, test } from "vitest";
import { openQuestionGroups, openQuestions } from "./openQuestions.ts";
import { sections } from "./sections.ts";
import { sources } from "./sources.ts";

test("reader questions have stable unique IDs, topic groups, useful checks and router links", () => {
  expect(openQuestionGroups.map(({ id }) => id)).toEqual([
    "timers",
    "festival",
    "cubes",
    "gear",
    "daevanion",
    "appearances",
  ]);
  expect(openQuestions).toHaveLength(27);
  expect(new Set(openQuestions.map(({ id }) => id)).size).toBe(
    openQuestions.length,
  );

  for (const group of openQuestionGroups) {
    expect(group.title.length).toBeGreaterThan(3);
    expect(openQuestions.some(({ groupId }) => groupId === group.id)).toBe(
      true,
    );
  }

  for (const question of openQuestions) {
    expect(question.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    expect(openQuestionGroups.some(({ id }) => id === question.groupId)).toBe(
      true,
    );
    expect(question.unknown.length).toBeGreaterThan(20);
    expect(question.why.length).toBeGreaterThan(20);
    expect(question.practicalCheck.length).toBeGreaterThan(20);
    expect(question.relatedGuideLinks.length).toBeGreaterThan(0);

    for (const link of question.relatedGuideLinks) {
      expect(link.to.startsWith("/")).toBe(true);
      expect(
        sections.some(
          ({ path }) =>
            link.to === `/${path}` || link.to.startsWith(`/${path}/`),
        ),
      ).toBe(true);
      expect(link.label.length).toBeGreaterThan(3);
    }

    expect(question.supportingSourceIDs.length).toBeGreaterThan(0);

    for (const id of question.supportingSourceIDs) {
      expect(id in sources).toBe(true);
      expect("url" in sources[id] && sources[id].url).toMatch(/^https:\/\//);
    }
  }
});

test.each([
  ["eu-reset", /daily and weekly reset/i],
  ["eu-server-zone", /EU server.*time zone/i],
  ["kaira-argo-spawns", /Kaira.*interval.*Argo/i],
  ["faction-boss-respawns", /Verteron.*respawn/i],
  ["invasion-duration-rotation", /duration.*rotation/i],
  ["festival-card-key-mapping", /rank.*card selections.*openings.*keys/i],
  ["festival-refill", /refill.*quantity.*reset/i],
  ["festival-participation-claim", /participation.*without a key/i],
  ["festival-level-mapping", /level-50.*level 45/i],
  ["festival-shop-rotation", /shop.*rotate/i],
  ["hidden-cube-level-scaling", /level scaling.*Verteron.*Altgard/i],
  ["transfer-sync-requirements", /Transfer.*Sync.*source item's fate/i],
  ["soul-binding-cost", /Bind.*cost/i],
  ["engraving-stone-loss", /ticked.*slots.*keep.*stones/i],
  ["clash-rune-shop", /Clash Rune.*price.*stock/i],
  ["skin-owned-stat-sharing", /owned stats.*alts/i],
  ["optional-skin-chests", /Skin Chest.*Reward Chest/i],
])(
  "retains practical uncertainty %s from current topic notes",
  (id, meaning) => {
    const question = openQuestions.find((entry) => entry.id === id);

    expect(question?.unknown).toMatch(meaning);
  },
);

test.each([
  [
    "daevanion-skill-priorities",
    "daevanion",
    /skill priorities.*Critical Hit Resist.*tank.*healer/i,
    ["/daevanion"],
  ],
  [
    "azphel-pve-effects",
    "daevanion",
    /Status Effect.*monsters.*Combat Power/i,
    ["/daevanion"],
  ],
  [
    "daevanion-reset-refund",
    "daevanion",
    /reset.*refund.*cost/i,
    ["/daevanion"],
  ],
  ["gear-pity-contents", "gear", /pity.*contain.*skipped cube/i, ["/gear"]],
  [
    "gear-voucher-acquisition",
    "gear",
    /Voucher.*mode.*guarantee.*cube/i,
    ["/gear", "/alts"],
  ],
  [
    "weapon-alt-transfer",
    "gear",
    /weapon.*selection.*Server Storage/i,
    ["/gear", "/alts"],
  ],
  [
    "subjugation-rewards",
    "gear",
    /Subjugation.*item rewards.*menu/i,
    ["/gear", "/routine"],
  ],
  [
    "alt-currency-cap-scopes",
    "appearances",
    /Quna.*Centuryroot Tokens.*weekly.*cap/i,
    ["/alts", "/growth"],
  ],
  [
    "eu-event-slots",
    "timers",
    /Rift.*Executors.*Nahma.*ten-minute/i,
    ["/timers"],
  ],
] as const)(
  "covers retained gap %s and links its affected sections",
  (id, group, meaning, paths) => {
    const question = openQuestions.find((entry) => entry.id === id);

    expect(question?.groupId).toBe(group);
    expect(question?.unknown).toMatch(meaning);
    expect(question?.relatedGuideLinks.map(({ to }) => to)).toEqual(paths);
  },
);

test("keeps the expanded catalogue acquisition gap explicit without treating existence as availability", () => {
  const question = openQuestions.find(
    ({ id }) => id === "skin-catalogue-acquisition",
  );

  expect(question?.unknown).toMatch(
    /piece-specific.*random-shop.*Poko.*seasonal/i,
  );
  expect(question?.why).toMatch(/client.*obtained now/i);
  expect(question?.practicalCheck).toMatch(
    /piece.*source.*probability.*Global shop/i,
  );
  expect(question?.relatedGuideLinks).toEqual([
    { to: "/skins", label: "Full non-weapon appearance reference" },
  ]);
});

test("excludes private profiles, artifact links, evidence labels and already resolved questions", () => {
  const copy = openQuestions
    .map(({ unknown, why, practicalCheck }) =>
      [unknown, why, practicalCheck].join(" "),
    )
    .join(" ");

  expect(copy).not.toMatch(
    /Ipsith|Nemon|character-info|claude\.ai|artifact\/|https?:\/\/|\[S\d+\]|Client-derived:|Guide-reported:/i,
  );
  expect(openQuestions.map(({ id }) => id)).not.toEqual(
    expect.arrayContaining([
      "wing-sharing",
      "kina-all",
      "festival-storage-caps",
      "extract-skin-destruction",
    ]),
  );
  expect(copy).not.toMatch(
    /whether wings.*shared|whether.*Kina \(All\)|whether.*Extract Skin.*destroys|whether.*storage caps/i,
  );
});
