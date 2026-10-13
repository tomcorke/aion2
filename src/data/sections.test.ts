import { expect, test } from "vitest";
import { sections } from "./sections.ts";

test("section paths are unique URL slugs", () => {
  const paths = sections.map(({ path }) => path);

  expect(new Set(paths).size).toBe(paths.length);

  for (const path of paths) expect(path).toMatch(/^[a-z0-9-]+$/);
});

test("every section has a title and a one-sentence summary", () => {
  for (const { title, summary } of sections) {
    expect(title).not.toBe("");
    expect(summary).toMatch(/\.$/);
  }
});
