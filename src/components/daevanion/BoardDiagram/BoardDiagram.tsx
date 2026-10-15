import { useRef, useState, type KeyboardEvent } from "react";
import {
  describeNode,
  position,
  type ViewNode,
} from "../../../lib/daevanionNode.ts";
import STYLES from "./BoardDiagram.module.css";

type Props = {
  name: string;
  nodes: ViewNode[];
  // Node keys in purchase order.
  steps: string[];
  start: string;
  selected: string | null;
  onSelect: (key: string) => void;
};

// One SVG unit is one CSS pixel at natural size, so every tap target is 44px.
// Zoom only ever enlarges; shrinking the board would shrink the targets.
const CELL = 44;

const moves: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const key = (row: number, col: number) => `${row},${col}`;

const neighbours = (row: number, col: number) =>
  Object.values(moves).map(([dr, dc]) => key(row + dr, col + dc));

/** Each purchase joins an orthogonal neighbour bought earlier, or Start. */
function routeEdges(steps: string[], start: string) {
  const owned = new Set([start]);

  return steps.flatMap((step) => {
    const [row, col] = step.split(",").map(Number);
    const from = neighbours(row, col).find((candidate) => owned.has(candidate));

    owned.add(step);

    return from ? [[from, step]] : [];
  });
}

function Shape({ view }: { view: ViewNode }) {
  if (view.node.type === "Start")
    return (
      <rect x={-12} y={-12} width={24} height={24} className={STYLES.start} />
    );

  if (view.step === null) return <circle r={4} className={STYLES.off} />;

  const shape = view.target ? (
    <rect x={-10} y={-10} width={20} height={20} transform="rotate(45)" />
  ) : (
    <circle r={12} />
  );

  return (
    <>
      {view.next && <circle r={18} className={STYLES.ring} />}
      <g className={view.bought ? STYLES.bought : STYLES.later}>{shape}</g>
      <text
        dy="0.35em"
        className={view.bought ? STYLES.boughtText : STYLES.text}
      >
        {view.step}
      </text>
    </>
  );
}

/** SVG board: one tab stop, arrow keys walk between nodes, Enter or a tap selects. */
export function BoardDiagram({
  name,
  nodes,
  steps,
  start,
  selected,
  onSelect,
}: Props) {
  const [zoomed, setZoomed] = useState(false);
  const refs = useRef(new Map<string, SVGGElement>());
  const byKey = new Map(nodes.map((view) => [view.node.key, view]));
  const rows = nodes.map(({ node }) => node.row);
  const cols = nodes.map(({ node }) => node.col);
  const top = Math.min(...rows);
  const left = Math.min(...cols);
  const width = (Math.max(...cols) - left + 1) * CELL;
  const height = (Math.max(...rows) - top + 1) * CELL;
  const scale = zoomed ? 2 : 1;
  const x = (col: number) => (col - left + 0.5) * CELL;
  const y = (row: number) => (row - top + 0.5) * CELL;
  const focusable =
    selected ?? nodes.find((view) => view.next)?.node.key ?? start;
  const edges = routeEdges(steps, start);

  const grid = nodes.flatMap(({ node }) =>
    [key(node.row, node.col + 1), key(node.row + 1, node.col)]
      .filter((other) => byKey.has(other))
      .map((other) => [node.key, other]),
  );

  const line = ([from, to]: string[], className: string) => {
    const a = byKey.get(from)!.node;
    const b = byKey.get(to)!.node;

    return (
      <line
        key={`${from}-${to}`}
        x1={x(a.col)}
        y1={y(a.row)}
        x2={x(b.col)}
        y2={y(b.row)}
        className={className}
      />
    );
  };

  function onKeyDown(event: KeyboardEvent, view: ViewNode) {
    const move = moves[event.key];

    if (!move) return;

    event.preventDefault();

    // Skip gaps in the grid until another node turns up in that direction.
    for (let step = 1; step <= 16; step++) {
      const target = key(
        view.node.row + move[0] * step,
        view.node.col + move[1] * step,
      );

      if (byKey.has(target)) {
        onSelect(target);
        refs.current.get(target)?.focus();

        return;
      }
    }
  }

  return (
    <figure className={STYLES.figure}>
      <button
        type="button"
        aria-pressed={zoomed}
        className={STYLES.zoom}
        onClick={() => setZoomed(!zoomed)}
      >
        Zoom to double size
      </button>

      <div className={STYLES.scroller}>
        <svg
          role="group"
          aria-label={`${name} board diagram`}
          viewBox={`0 0 ${width} ${height}`}
          width={width * scale}
          height={height * scale}
          className={STYLES.board}
        >
          <g aria-hidden="true">
            {grid.map((pair) => line(pair, STYLES.grid))}
            {edges.map((pair) => {
              const bought = byKey.get(pair[1])!.bought;

              return line(pair, bought ? STYLES.edgeBought : STYLES.edge);
            })}
          </g>

          {nodes.map((view) => (
            <g
              key={view.node.key}
              ref={(element) => {
                if (element) refs.current.set(view.node.key, element);
              }}
              role="button"
              tabIndex={view.node.key === focusable ? 0 : -1}
              aria-pressed={view.node.key === selected}
              aria-label={`${position(view.node)}: ${describeNode(view)}`}
              transform={`translate(${x(view.node.col)} ${y(view.node.row)})`}
              className={STYLES.node}
              onClick={() => onSelect(view.node.key)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(view.node.key);
                } else onKeyDown(event, view);
              }}
            >
              <rect
                x={-CELL / 2}
                y={-CELL / 2}
                width={CELL}
                height={CELL}
                className={STYLES.hit}
              />
              {view.node.key === selected && (
                <rect
                  x={-19}
                  y={-19}
                  width={38}
                  height={38}
                  className={STYLES.selected}
                />
              )}
              <Shape view={view} />
            </g>
          ))}
        </svg>
      </div>

      <figcaption className={STYLES.legend}>
        The square is Start and numbers give the purchase order. Diamonds are
        targets and circles are connectors; filled shapes fit the budget, and an
        outer ring marks the next purchase. Small dots are nodes this route
        skips. Select a node, or use the arrow keys, for its details. On a small
        screen, scroll the board sideways; zoom doubles its size.
      </figcaption>
    </figure>
  );
}
