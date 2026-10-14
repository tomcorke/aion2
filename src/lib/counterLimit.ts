import type { ResourceCounter } from "../data/alts.ts";

/** Caps are separate only for bankable counts, not weekly allowances or time budgets. */
export function counterLimit({
  limit,
  kind,
  cap,
  membershipCap,
}: ResourceCounter) {
  if (cap === undefined || kind === "weekly" || kind === "time-budget")
    return limit;

  const membership = membershipCap ? ` (${membershipCap} with membership)` : "";

  return `${limit}, cap ${cap}${membership}`;
}
