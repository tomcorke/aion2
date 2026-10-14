import type { PurchaseRoute } from "../data/daevanionRoutes.ts";

/** URL input is a hypothetical budget, never an owned-node list. */
export function parseRouteBudget(
  raw: string | number | null | undefined,
  total: number,
): { points: number; message: string | null } {
  if (raw === null || raw === undefined) return { points: 0, message: null };

  const value = Number(raw);

  if (!Number.isFinite(value) || (typeof raw === "string" && !raw.trim())) {
    return {
      points: 0,
      message: "Enter a finite, non-negative whole point budget.",
    };
  }

  const points = Math.min(total, Math.max(0, Math.floor(value)));

  return {
    points,
    message:
      points === value
        ? null
        : `Budget adjusted to ${points} whole points (0–${total}).`,
  };
}

/** Canonical cumulative costs include connectors: stop at the first unaffordable purchase. */
export function getRouteBudget(
  route: PurchaseRoute,
  raw: string | number | null | undefined,
) {
  const budget = parseRouteBudget(raw, route.total);
  const firstUnaffordable = route.steps.findIndex(
    (step) => step.cumulativeCost > budget.points,
  );
  const count = firstUnaffordable < 0 ? route.steps.length : firstUnaffordable;
  const purchases = route.steps.slice(0, count);
  const spent = purchases.at(-1)?.cumulativeCost ?? 0;
  const next = route.steps[count] ?? null;

  return {
    ...budget,
    purchases,
    spent,
    leftover: budget.points - spent,
    next,
    nextCost: next ? next.cumulativeCost - spent : null,
  };
}
