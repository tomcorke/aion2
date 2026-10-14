/// <reference types="node" />
import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { daevanionClasses, daevanionPools } from "./daevanion.ts";
import { daevanionRouteData } from "./daevanionRoutes.ts";
import type { BoardGeometry, PurchaseRoute } from "./daevanionRoutes.ts";

// Literal costs from the retained Markdown, independent of app route steps.
const expected = {
  gladiator: [
    [100, 113, 114],
    [100, 106, 103],
    [93, 103, 106],
    [116, 124, 135],
  ],
  templar: [
    [98, 113, 117],
    [96, 106, 103],
    [89, 103, 108],
    [114, 124, 136],
  ],
  assassin: [
    [107, 113, 117],
    [100, 106, 103],
    [97, 103, 108],
    [118, 124, 136],
  ],
  ranger: [
    [103, 113, 114],
    [98, 106, 102],
    [93, 103, 105],
    [115, 124, 133],
  ],
  sorcerer: [
    [109, 113, 114],
    [95, 106, 102],
    [93, 103, 105],
    [114, 124, 133],
  ],
  spiritmaster: [
    [107, 113, 115],
    [95, 106, 102],
    [92, 103, 103],
    [115, 124, 133],
  ],
  cleric: [
    [90, 113, 107],
    [85, 106, 96],
    [83, 103, 97],
    [105, 124, 126],
  ],
  chanter: [
    [97, 113, 115],
    [98, 106, 101],
    [90, 103, 106],
    [115, 124, 134],
  ],
};
const variants = ["damage", "utility", "defense"] as const;
const damageStats = new Set([
  "FixingDamage",
  "Critical",
  "AmplifyAllDamage",
  "AmplifyCriticalDamage",
  "AdditionalHitRate",
  "CombatSpeed",
  "CoolTimeDecrease",
]);

function checkOrder(board: BoardGeometry, route: PurchaseRoute) {
  const nodes = new Map(board.nodes.map((node) => [node.key, node]));
  const seen = new Set([board.start]);
  let spend = 0;
  let phase = 0;

  for (const step of route.steps) {
    const node = nodes.get(step.node)!;

    expect(node, step.node).toBeDefined();
    expect(seen.has(step.node), step.node).toBe(false);
    expect(
      [...seen].some(
        (key) =>
          Math.abs(nodes.get(key)!.row - node.row) +
            Math.abs(nodes.get(key)!.col - node.col) ===
          1,
      ),
      step.node,
    ).toBe(true);
    expect(step.phase).toBeGreaterThanOrEqual(phase);
    expect(step.phase).toBeLessThan(route.phaseEnd.length);
    phase = step.phase;
    spend += node.cost;
    expect(step.cumulativeCost).toBe(spend);
    seen.add(step.node);
  }

  expect(spend).toBe(route.total);
  expect(new Set(route.targets).size).toBe(route.targets.length);
  expect(route.targets.every((key) => seen.has(key))).toBe(true);
  expect(route.phaseEnd).toEqual(
    route.phaseEnd.map((_, index) =>
      Math.max(
        0,
        ...route.steps
          .filter((step) => step.phase <= index)
          .map((step) => step.cumulativeCost),
      ),
    ),
  );
}

test("shared geometry has canonical identifiers, actual nodes and full costs", () => {
  expect(Object.keys(daevanionRouteData.boards)).toEqual([
    "nezekan",
    "zikel",
    "vaizel",
    "triniel",
    "azphel",
  ]);
  expect(
    Object.values(daevanionRouteData.boards).map((board) => [
      board.nodes.length,
      board.total,
      board.level,
    ]),
  ).toEqual([
    [89, 134, 12],
    [89, 134, 20],
    [89, 134, 30],
    [117, 168, 40],
    [153, 232, 45],
  ]);

  for (const board of Object.values(daevanionRouteData.boards)) {
    expect(new Set(board.nodes.map((node) => node.key)).size).toBe(
      board.nodes.length,
    );
    expect(board.nodes.reduce((sum, node) => sum + node.cost, 0)).toBe(
      board.total,
    );
    expect(board.nodes.filter((node) => node.type === "Start")).toMatchObject([
      { key: "8,8", cost: 0 },
    ]);
    expect(board.start).toBe("8,8");
    expect(
      board.nodes.every((node) => node.key === `${node.row},${node.col}`),
    ).toBe(true);
  }
});

describe.each(daevanionClasses)("$name retained class data", (overview) => {
  const entry = daevanionRouteData.classes[overview.id];
  const skills = new Map(entry.skills.map((skill) => [skill.id, skill]));

  test("all 22 named skills match the lightweight overview and have four associations", () => {
    const associations = Object.values(entry.boards).flatMap((board) =>
      Object.values(board.skills),
    );

    expect(skills.size).toBe(22);
    expect(new Set(entry.skills.map((skill) => skill.name)).size).toBe(22);
    expect(Object.keys(entry.boards)).toEqual([...daevanionPools.pve.boardIds]);
    expect(entry.skills.map((skill) => skill.name).sort()).toEqual(
      Object.values(overview.skills).flat().sort(),
    );

    for (const skill of entry.skills) {
      expect(associations.filter((id) => id === skill.id)).toHaveLength(4);
      expect(skill.maxRankTooltip).not.toBe("");
      expect(skill.sourceUrl).toMatch(
        /^https:\/\/metabot.gg\/en\/aion-2\/skills\//,
      );
      const group = skill.role === "damage-core" ? "damage" : skill.role;

      expect(overview.skills[group]).toContain(skill.name);
    }
  });

  test.each(daevanionPools.pve.boardIds)(
    "%s variants preserve targets, order and literal totals",
    (boardId) => {
      const board = daevanionRouteData.boards[boardId];
      const classBoard = entry.boards[boardId];
      const damage = board.nodes
        .filter(
          (node) =>
            damageStats.has(node.stats[0]?.stat) ||
            ["core", "damage-core", "damage"].includes(
              skills.get(classBoard.skills[node.key])?.role ?? "",
            ),
        )
        .map((node) => node.key);
      const skillNodes = board.nodes
        .filter((node) => node.type === "SkillLevel")
        .map((node) => node.key);
      const defense = board.nodes
        .filter(
          (node) =>
            ["HPMax", "Defense"].includes(node.stats[0]?.stat) ||
            skills.get(classBoard.skills[node.key])?.role === "defensive",
        )
        .map((node) => node.key);
      const targets = [
        damage,
        [...new Set([...damage, ...skillNodes])],
        [...new Set([...damage, ...defense])],
      ];
      const index = daevanionPools.pve.boardIds.indexOf(boardId);

      expect(Object.keys(classBoard.skills).sort()).toEqual(skillNodes.sort());
      expect(
        Object.values(classBoard.skills).every((id) => skills.has(id)),
      ).toBe(true);
      expect(Object.keys(classBoard.routes)).toEqual([...variants]);
      expect(classBoard.damageTargetCost).toBe(
        board.nodes
          .filter((node) => damage.includes(node.key))
          .reduce((sum, node) => sum + node.cost, 0),
      );

      for (const [variantIndex, variant] of variants.entries()) {
        const route = classBoard.routes[variant];

        checkOrder(board, route);
        expect(route.targets.toSorted()).toEqual(
          targets[variantIndex].toSorted(),
        );
        expect(route.total).toBe(expected[overview.id][index][variantIndex]);
        expect(route.total).toBe(overview.routes[variant].boardCosts[boardId]);
      }
    },
  );

  test("all board costs sum to the independent class totals", () => {
    for (const variant of variants) {
      expect(
        Object.values(entry.boards).reduce(
          (sum, board) => sum + board.routes[variant].total,
          0,
        ),
      ).toBe(overview.routes[variant].total);
      expect(entry.totals[variant]).toBe(overview.routes[variant].total);
    }
  });
});

test("shared Azphel route validates both phases and all 24 non-PvP targets", () => {
  const board = daevanionRouteData.boards.azphel;
  const route = daevanionRouteData.azphel;
  const hpMp = board.nodes.filter((node) =>
    ["HPMax", "MPMax"].includes(node.stats[0]?.stat),
  );
  const status = board.nodes.filter((node) =>
    ["AbnormalAccuracy", "AbnormalResistance"].includes(node.stats[0]?.stat),
  );
  const phaseOne = route.steps
    .filter((step) => step.phase === 0)
    .map((step) => step.node);

  checkOrder(board, route);
  expect(route.variantId).toBe("hp-mp-first");
  expect(route.phaseEnd).toEqual([36, 114]);
  expect(route.total).toBe(114);
  expect(route.phaseEnd[1] - route.phaseEnd[0]).toBe(78);
  expect(hpMp).toHaveLength(8);
  expect(status).toHaveLength(16);
  expect(hpMp.every((node) => phaseOne.includes(node.key))).toBe(true);
  expect(route.targets.toSorted()).toEqual(
    [...hpMp, ...status].map((node) => node.key).toSorted(),
  );
  expect(
    hpMp
      .filter((node) => node.stats[0].stat === "HPMax")
      .reduce((sum, node) => sum + node.stats[0].value, 0),
  ).toBe(400);
  expect(
    hpMp
      .filter((node) => node.stats[0].stat === "MPMax")
      .reduce((sum, node) => sum + node.stats[0].value, 0),
  ).toBe(200);
});

test("provenance retains source dates, build and exact canonical reference content", () => {
  expect(daevanionRouteData.provenance).toEqual({
    region: "Global",
    clientBuild: "0.0.4387.0",
    knowledgeCommit: "4cf748853f2555ce184cf8bcefdf18cd4af90180",
    sourceChecked: {
      S124: "2026-10-10",
      S126: "2026-10-11",
      S127: "2026-10-11",
    },
  });
  expect(Object.keys(daevanionRouteData.classes)).toEqual(
    Object.keys(expected),
  );
  const { boards, classes, phases, azphel } = daevanionRouteData;
  const originalAzphel = Object.fromEntries(
    Object.entries(azphel).filter(([key]) => key !== "variantId"),
  );
  const digest = createHash("sha256")
    .update(JSON.stringify({ boards, classes, phases, azphel: originalAzphel }))
    .digest("hex");

  // Fingerprint taken once from knowledge main, not derived from app data.
  expect(digest).toBe(
    "b6dfe7adb751362b0c82b6b3c1551784bd440f021cae55cf08b6466256d1e176",
  );
});
