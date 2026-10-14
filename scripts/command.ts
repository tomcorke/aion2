import { execFileSync } from "node:child_process";

export function run(command: string, ...args: string[]) {
  // Only pnpm's Windows .cmd shim needs a shell; native Git must preserve argv.
  execFileSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32" && command === "pnpm",
  });
}

export function read(command: string, ...args: string[]) {
  return execFileSync(command, args, { encoding: "utf8" }).trim();
}
