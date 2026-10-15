import type { BoardNode, RouteSkill } from "../data/daevanionRoutes.ts";

/** One board node as the selected route and budget see it. */
export type ViewNode = {
  node: BoardNode;
  name: string;
  skill?: RouteSkill;
  // One-based purchase order; null when the route never buys the node.
  step: number | null;
  phase: string | null;
  cumulativeCost: number | null;
  target: boolean;
  bought: boolean;
  next: boolean;
};

export const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

export const position = ({ row, col }: BoardNode) =>
  `Row ${row}, column ${col}`;

/** Text for screen readers, the list and the detail panel alike. */
export function describeNode(view: ViewNode) {
  if (view.node.type === "Start") return "Start, free";

  const head = `${view.name}, ${plural(view.node.cost, "point")}`;

  if (view.step === null) return `${head}, not on this route`;

  let status = "beyond budget";

  if (view.bought) status = "within budget";
  else if (view.next) status = "next purchase";

  return `${head}, step ${view.step}, ${view.target ? "target" : "connector"}, ${status}`;
}
