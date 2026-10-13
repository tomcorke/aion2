import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { basename, dirname } from "node:path";
import { test } from "node:test";

const src = new URL("../src/", import.meta.url).pathname.replace(
  /^\/(\w:)/,
  "$1",
);
const files = readdirSync(src, { recursive: true, encoding: "utf8" }).map((f) =>
  f.replaceAll("\\", "/"),
);
const globalCss = new Set(["tokens.css", "index.css"]);

test("CSS is global or a module named after its folder's component", () => {
  for (const file of files.filter(
    (f) => f.endsWith(".css") && !globalCss.has(f),
  )) {
    const name = basename(dirname(file));

    assert.equal(basename(file), `${name}.module.css`, file);
    assert.ok(
      files.includes(`${dirname(file)}/${name}.tsx`),
      `${file} has no ${name}.tsx beside it`,
    );
  }
});

test("each component and page has its own folder", () => {
  for (const file of files.filter((f) =>
    /^(components|pages)\/.+\.tsx$/.test(f),
  )) {
    const parts = file.split("/");

    assert.equal(parts.length, 3, `${file} should be <kind>/<Name>/<Name>.tsx`);
    assert.equal(parts[2], `${parts[1]}.tsx`, file);
  }
});
