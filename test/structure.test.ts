// @vitest-environment node
import { readdirSync } from "node:fs";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

// Checks the folder conventions in AGENTS.md ("Code").
const src = fileURLToPath(new URL("../src/", import.meta.url));

const files = readdirSync(src, { recursive: true, encoding: "utf8" })
  .map((file) => file.replaceAll("\\", "/"))
  .filter((file) => /\.\w+$/.test(file));

const isTest = (file: string) => /\.test\.tsx?$/.test(file);
const globalCss = ["styles/tokens.css", "styles/global.css"];

// testing/ holds test helpers, not app code.
const sources = files.filter(
  (file) =>
    /\.tsx?$/.test(file) && !isTest(file) && !file.startsWith("testing/"),
);

describe("src layout", () => {
  test("only main.tsx sits at the top of src", () => {
    expect(files.filter((file) => !file.includes("/"))).toEqual(["main.tsx"]);
  });

  test("CSS is global or a module named after its component", () => {
    for (const file of files.filter(
      (f) => f.endsWith(".css") && !globalCss.includes(f),
    )) {
      const name = basename(dirname(file));

      expect(basename(file), file).toBe(`${name}.module.css`);
      expect(files, `${file} has no ${name}.tsx beside it`).toContain(
        `${dirname(file)}/${name}.tsx`,
      );
    }
  });

  test("components sit in components/<group>/<Name>/<Name>.tsx", () => {
    for (const file of sources.filter((f) => f.startsWith("components/"))) {
      expect(file).toMatch(/^components\/[a-z]+\/([A-Z]\w*)\/\1\.tsx$/);
    }
  });

  test("pages sit in pages/<Name>/<Name>.tsx", () => {
    for (const file of sources.filter((f) => f.startsWith("pages/"))) {
      expect(file).toMatch(/^pages\/([A-Z]\w*)\/\1\.tsx$/);
    }
  });

  test("every source file has a test beside it", () => {
    const untested = sources
      .filter((file) => file !== "main.tsx")
      .filter((file) => {
        const stem = file.replace(/\.tsx?$/, "");

        return (
          !files.includes(`${stem}.test.ts`) &&
          !files.includes(`${stem}.test.tsx`)
        );
      });

    expect(untested).toEqual([]);
  });
});
