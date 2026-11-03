import { useEffect, useId, useState } from "react";
import {
  arielOverview,
  azphelOverview,
  daevanionBoards,
  daevanionCaveats,
  daevanionPools,
  daevanionVariants,
  type DaevanionBoardId,
  type DaevanionClass,
  type DaevanionVariantId,
} from "../../../data/daevanion.ts";
import { parseRouteBudget } from "../../../lib/daevanionBudget.ts";
import { loadClassRoutes } from "../../../lib/daevanionLoader.ts";
import { Tabs } from "../../controls/Tabs/Tabs.tsx";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import { BoardView } from "../BoardView/BoardView.tsx";
import STYLES from "./RouteViewer.module.css";

type Loaded = Awaited<ReturnType<typeof loadClassRoutes>>;

function selectedRoute(
  data: Loaded,
  board: DaevanionBoardId,
  variant: DaevanionVariantId | undefined,
) {
  if (board === "azphel")
    return { route: data.azphel, phases: data.azphel.phases, skillMap: {} };

  if (board === "ariel")
    return { route: data.ariel, phases: data.ariel.phases, skillMap: {} };

  if (!variant) return undefined;

  const classBoard = data.classRoutes.boards[board];

  return {
    route: classBoard.routes[variant],
    phases: data.phases,
    skillMap: classBoard.skills,
  };
}

type Props = {
  entry: DaevanionClass;
  boardId: string;
  variantId: string | undefined;
  rawPoints: string | null;
};

const azphelTotal = azphelOverview.phases.at(-1)!.cumulativeCost;

function routeTotal(
  entry: DaevanionClass,
  board: DaevanionBoardId,
  variant: DaevanionVariantId,
) {
  if (board === "azphel") return azphelTotal;
  if (board === "ariel") return arielOverview.fullCost;

  return entry.routes[variant].boardCosts[board];
}

function routePath(board: DaevanionBoardId, variant: DaevanionVariantId) {
  if (board === "azphel" || board === "ariel") return board;

  return `${board}/${variant}`;
}

function boardNotes(board: DaevanionBoardId) {
  if (board === "azphel")
    return [
      daevanionPools.azphel.description,
      daevanionCaveats.emptyBoard,
      azphelOverview.statusEffectCaveat,
      azphelOverview.alternativeCaveat,
    ];

  if (board === "ariel") return [daevanionPools.ariel.description];

  return [daevanionPools.pve.description, daevanionCaveats.emptyBoard];
}

function hasWrongVariant(
  board: DaevanionBoardId | undefined,
  variantId: string | undefined,
  variant: (typeof daevanionVariants)[number] | undefined,
) {
  if (!board || variant) return false;
  if (board === "azphel")
    return ![undefined, "hp-mp-first"].includes(variantId);

  return board === "ariel" ? variantId !== undefined : true;
}

function wrongVariantMessage(
  board: DaevanionBoardId,
  variantId: string | undefined,
) {
  if (board === "azphel")
    return `Azphel has one shared route for every class; “${variantId}” does not apply.`;
  if (board === "ariel")
    return `Ariel has one full-board traversal; “${variantId}” does not apply.`;

  return `There is no “${variantId}” route. Pick one of the three routes above.`;
}

/** Loads one class's routes; a result for an earlier class is ignored. */
function useClassRoutes(classId: string, enabled: boolean) {
  const [result, setResult] = useState<{ classId: string; data?: Loaded }>();

  useEffect(() => {
    if (!enabled) return;

    let current = true;

    loadClassRoutes(classId).then(
      (data) => current && setResult({ classId, data }),
      () => current && setResult({ classId }),
    );

    return () => {
      current = false;
    };
  }, [classId, enabled]);

  const settled = result?.classId === classId ? result : undefined;

  return {
    data: settled?.data?.classId === classId ? settled.data : undefined,
    failed: settled !== undefined && !settled.data,
  };
}

/** Board and route tabs over the selected board's diagram, purchase order and budget. */
export function RouteViewer({ entry, boardId, variantId, rawPoints }: Props) {
  const id = useId();
  const board = daevanionBoards.find(({ id }) => id === boardId);
  const azphel = board?.id === "azphel";
  const ariel = board?.id === "ariel";
  const { data, failed } = useClassRoutes(entry.id, true);

  const variant =
    azphel || ariel
      ? undefined
      : daevanionVariants.find(({ id }) => id === (variantId ?? "damage"));

  // Links only target known routes, clamping the budget to that route's total.
  const href = (
    board: DaevanionBoardId,
    variant: DaevanionVariantId = "damage",
  ) => {
    const points = parseRouteBudget(
      rawPoints,
      routeTotal(entry, board, variant),
    ).points;
    const path = routePath(board, variant);

    const query = !points ? "" : `?points=${points}`;

    return `/daevanion/${entry.id}/${path}${query}`;
  };

  const boardTabs = daevanionBoards.map(({ id, name }) => ({
    id,
    label: name,
    to: href(id, variant?.id),
  }));

  const variantTabs =
    board && !azphel && !ariel
      ? daevanionVariants.map(({ id, label }) => ({
          id,
          label,
          to: href(board.id, id),
        }))
      : [];

  const notes = board ? boardNotes(board.id) : [];
  const wrongVariant = hasWrongVariant(board?.id, variantId, variant);
  const routeData =
    data && board && (azphel || ariel || variant)
      ? selectedRoute(data, board.id, variant?.id)
      : undefined;

  return (
    <section aria-labelledby={id} className={STYLES.viewer}>
      <h2 id={id}>{ariel ? "Ariel board traversal" : "Board routes"}</h2>

      <Tabs label="Board" tabs={boardTabs} selected={board?.id}>
        {!board && (
          <p className={STYLES.missing}>
            There is no “{boardId}” board. Pick one of the six boards above.
          </p>
        )}

        {board && !azphel && !ariel && (
          <Tabs label="Route" tabs={variantTabs} selected={variant?.id}>
            {variant && <p>{variant.description}</p>}
          </Tabs>
        )}

        {wrongVariant && (
          <p className={STYLES.missing}>
            {board && wrongVariantMessage(board.id, variantId)}
          </p>
        )}

        {board && (azphel || ariel || variant) && (
          <>
            <ul className={STYLES.notes}>
              {notes.map((note) => (
                <li key={note}>
                  <Diamond />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            {ariel && (
              <>
                <dl className={STYLES.summary}>
                  <div>
                    <dt>Unlocks</dt>
                    <dd>Level {board.opensAt}</dd>
                  </div>
                  <div>
                    <dt>Nodes</dt>
                    <dd>{arielOverview.nodeCount} stat; no skill nodes</dd>
                  </div>
                  <div>
                    <dt>Completion cost</dt>
                    <dd>{arielOverview.fullCost} points</dd>
                  </div>
                  <div>
                    <dt>Currency</dt>
                    <dd>{arielOverview.currency}</dd>
                  </div>
                </dl>
                <p className={STYLES.missing}>{arielOverview.traversalNote}</p>
              </>
            )}

            {failed && (
              <div role="alert" className={STYLES.state}>
                <p>The board routes did not load.</p>
                {/* The browser caches a failed module import for this document,
                    so only a reload (which keeps the URL) can fetch it again. */}
                <button
                  type="button"
                  onClick={() => globalThis.location.reload()}
                >
                  Reload and try again
                </button>
              </div>
            )}

            {!failed && !data && (
              <p role="status" className={STYLES.state}>
                Loading the {board.name} board…
              </p>
            )}

            {data && routeData && (
              <BoardView
                key={`${board.id}/${variant?.id}`}
                geometry={data.geometry[board.id]}
                route={routeData.route}
                phases={routeData.phases}
                skillMap={routeData.skillMap}
                skills={data.classRoutes.skills}
                rawPoints={rawPoints}
                traversal={ariel}
              />
            )}
          </>
        )}
      </Tabs>
    </section>
  );
}
