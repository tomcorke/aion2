// Publishes the built site to the `publish` branch, which GitHub Pages serves.
// Usage: pnpm release (from a clean `main` that matches `origin/main`).
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SITE = "https://aion.corke.dev/";
const BRANCH = "publish";

// pnpm is a .cmd shim on Windows, which only runs through a shell.
const shell = process.platform === "win32";

function run(command: string, ...args: string[]) {
  execFileSync(command, args, { stdio: "inherit", shell });
}

function read(command: string, ...args: string[]) {
  return execFileSync(command, args, { encoding: "utf8", shell }).trim();
}

function fail(message: string): never {
  console.error(`release: ${message}`);
  process.exit(1);
}

function checkMain() {
  if (read("git", "branch", "--show-current") !== "main") fail("run from main");

  if (read("git", "status", "--porcelain"))
    fail("commit or stash changes first");

  run("git", "fetch", "--quiet", "origin");

  if (
    read("git", "rev-parse", "HEAD") !== read("git", "rev-parse", "origin/main")
  ) {
    fail("main and origin/main differ; pull or push first");
  }

  return read("git", "rev-parse", "HEAD");
}

function build() {
  run("pnpm", "install", "--frozen-lockfile");

  for (const check of ["test", "lint", "typecheck", "format:check", "build"])
    run("pnpm", check);
}

/** Commits dist/ to the publish branch from a throwaway worktree. Returns false if nothing changed. */
function commitBuild(mainCommit: string) {
  const worktree = mkdtempSync(join(tmpdir(), "aion2-publish-"));
  const hasBranch =
    read("git", "ls-remote", "--heads", "origin", BRANCH) !== "";

  try {
    // Start from the published branch, or an empty one on the first release.
    const from = hasBranch
      ? ["-B", BRANCH, worktree, `origin/${BRANCH}`]
      : ["--orphan", "-B", BRANCH, worktree];

    run("git", "worktree", "add", "--force", ...from);

    const inWorktree = (...args: string[]) =>
      run("git", "-C", worktree, ...args);

    inWorktree("rm", "-rq", "--ignore-unmatch", ".");
    cpSync("dist", worktree, { recursive: true });
    inWorktree("add", "-A");

    if (!read("git", "-C", worktree, "status", "--porcelain")) return false;

    inWorktree(
      "commit",
      "-q",
      "-m",
      `Publish main@${mainCommit.slice(0, 7)}`,
      "-m",
      `Source-main-commit: ${mainCommit}`,
    );
    inWorktree("push", "-q", "origin", BRANCH);

    return true;
  } finally {
    run("git", "worktree", "remove", "--force", worktree);
    rmSync(worktree, { recursive: true, force: true });
    run("git", "branch", "-D", "-q", BRANCH);
  }
}

/** Waits for GitHub Pages to serve the new build, judged by the script file name in index.html. */
async function waitForSite() {
  const script = readFileSync("dist/index.html", "utf8").match(
    /assets\/index-[\w-]+\.js/,
  )?.[0];

  if (!script) fail("no script found in dist/index.html");

  for (let attempt = 0; attempt < 20; attempt++) {
    const page = await fetch(SITE, { cache: "no-store" }).then((response) =>
      response.text(),
    );

    if (page.includes(script))
      return console.log(`release: ${SITE} serves ${script}`);

    await new Promise((resolve) => setTimeout(resolve, 15_000));
  }

  fail(`${SITE} still serves an older build after 5 minutes`);
}

const mainCommit = checkMain();

build();

if (
  read("git", "rev-parse", "HEAD") !== mainCommit ||
  read("git", "status", "--porcelain")
) {
  fail("main changed during the build");
}

if (commitBuild(mainCommit)) await waitForSite();
else console.log("release: the built site is unchanged; nothing to publish");
