import assert from "node:assert/strict";
import { test } from "node:test";
import { sections } from "../src/sections.ts";

test("section paths are unique URL slugs", () => {
  const paths = sections.map(({ path }) => path);
  assert.equal(new Set(paths).size, paths.length);
  for (const path of paths) assert.match(path, /^[a-z0-9-]+$/);
});
