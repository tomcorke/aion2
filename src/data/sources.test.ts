import { expect, test } from "vitest";
import { imageCredits, sourceList } from "./sources.ts";

test("every source has a name, what it covers, and an https link when it has one", () => {
  for (const { name, covers, url } of sourceList) {
    expect(name).not.toBe("");
    expect(covers).not.toBe("");

    if (url) expect(url).toMatch(/^https:\/\//);
  }
});

test("source names are unique", () => {
  const names = sourceList.map(({ name }) => name);

  expect(new Set(names).size).toBe(names.length);
});

test("image credits link to their source", () => {
  for (const { url } of imageCredits) expect(url).toMatch(/^https:\/\//);
});
