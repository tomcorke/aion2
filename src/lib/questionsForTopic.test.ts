// @vitest-environment node
import { expect, test } from "vitest";
import { questionsForTopic } from "./questionsForTopic.ts";

test("matches deep advice links by their top-level section", () => {
  expect(questionsForTopic("festival").map(({ id }) => id)).toEqual([
    "festival-card-key-mapping",
    "festival-refill",
    "festival-participation-claim",
    "festival-level-mapping",
    "festival-shop-rotation",
  ]);
});

test("returns all three Daevanion questions in curated order", () => {
  expect(questionsForTopic("daevanion").map(({ id }) => id)).toEqual([
    "daevanion-skill-priorities",
    "azphel-pve-effects",
    "daevanion-reset-refund",
  ]);
});

test("a question can affect multiple sections without duplicate matches", () => {
  for (const topic of ["gear", "alts"]) {
    expect(
      questionsForTopic(topic).filter(({ id }) => id === "weapon-alt-transfer"),
    ).toHaveLength(1);
  }
});

test.each(["", "unknown", "sources", "gear/enhancement", "fest"])(
  "does not match an empty, unknown or partial section: %s",
  (topic) => {
    expect(questionsForTopic(topic)).toEqual([]);
  },
);
