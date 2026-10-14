// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import { read, run } from "./command.ts";

test.each(["repo", "publish worktree"])(
  "preserves spaced Git commit messages in %s",
  (directory) => {
    const temporary = mkdtempSync(join(tmpdir(), "aion2-command-"));
    const repo = join(temporary, directory);

    try {
      mkdirSync(repo);
      read("git", "init", "-q", repo);

      for (const [key, value] of [
        ["user.name", "Release Test"],
        ["user.email", "release@example.invalid"],
        ["commit.gpgsign", "false"],
        ["core.hooksPath", join(temporary, "no-hooks")],
      ]) {
        read("git", "-C", repo, "config", "--local", key, value);
      }

      writeFileSync(join(repo, "built site.txt"), "local regression\n");
      read("git", "-C", repo, "add", "--", "built site.txt");
      run(
        "git",
        "-C",
        repo,
        "commit",
        "-q",
        "-m",
        "Publish main@487b873",
        "-m",
        "Source-main-commit: 487b8730123456789012345678901234567890123",
      );

      expect(read("git", "-C", repo, "log", "-1", "--format=%B")).toBe(
        "Publish main@487b873\n\nSource-main-commit: 487b8730123456789012345678901234567890123",
      );
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  },
);
