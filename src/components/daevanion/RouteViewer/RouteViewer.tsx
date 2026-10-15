import { useEffect, useId, useState } from "react";
import {
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

type Props = {
  entry: DaevanionClass;
  boardId: string;
  variantId: string | undefined;
  rawPoints: string | null;
};

const azphelTotal = azphelOverview.phases.at(-1)!.cumulativeCost;

/** Loads one class's routes; a result for an earlier class or attempt is ignored. */
function useClassRoutes(classId: string) {
  const [attempt, setAttempt] = useState(0);

  const [result, setResult] = useState<{
    classId: string;
    attempt: number;
    data?: Loaded;
  }>();

  useEffect(() => {
    let current = true;

    loadClassRoutes(classId).then(
      (data) => current && setResult({ classId, attempt, data }),
      () => current && setResult({ classId, attempt }),
    );

    return () => {
      current = false;
    };
  }, [classId, attempt]);

  const settled =
    result?.classId === classId && result.attempt === attempt
      ? result
      : undefined;

  return {
    data: settled?.data?.classId === classId ? settled.data : undefined,
    failed: settled !== undefined && !settled.data,
    retry: () => setAttempt((count) => count + 1),
  };
}

/** Board and route tabs over the selected board's diagram, purchase order and budget. */
export function RouteViewer({ entry, boardId, variantId, rawPoints }: Props) {
  const id = useId();
  const { data, failed, retry } = useClassRoutes(entry.id);
  const board = daevanionBoards.find(({ id }) => id === boardId);
  const azphel = board?.id === "azphel";

  const variant = azphel
    ? undefined
    : daevanionVariants.find(({ id }) => id === (variantId ?? "damage"));

  const totalFor = (board: DaevanionBoardId, variant: DaevanionVariantId) =>
    board === "azphel" ? azphelTotal : entry.routes[variant].boardCosts[board];

  // Links only target known routes, clamping the budget to that route's total.
  const href = (
    board: DaevanionBoardId,
    variant: DaevanionVariantId = "damage",
  ) => {
    const points = parseRouteBudget(rawPoints, totalFor(board, variant)).points;
    const path = board === "azphel" ? board : `${board}/${variant}`;

    const query = points ? `?points=${points}` : "";

    return `/daevanion/${entry.id}/${path}${query}`;
  };

  const boardTabs = daevanionBoards.map(({ id, name }) => ({
    id,
    label: name,
    to: href(id, variant?.id),
  }));

  const variantTabs =
    board && !azphel
      ? daevanionVariants.map(({ id, label }) => ({
          id,
          label,
          to: href(board.id, id),
        }))
      : [];

  const notes = azphel
    ? [
        daevanionPools.azphel.description,
        daevanionCaveats.emptyBoard,
        azphelOverview.statusEffectCaveat,
        azphelOverview.alternativeCaveat,
      ]
    : [daevanionPools.pve.description, daevanionCaveats.emptyBoard];

  const wrongVariant =
    board &&
    !variant &&
    !(azphel && [undefined, "hp-mp-first"].includes(variantId));

  return (
    <section aria-labelledby={id} className={STYLES.viewer}>
      <h2 id={id}>Board routes</h2>

      <Tabs label="Board" tabs={boardTabs} selected={board?.id}>
        {!board && (
          <p className={STYLES.missing}>
            There is no “{boardId}” board. Pick one of the five boards above.
          </p>
        )}

        {board && !azphel && (
          <Tabs label="Route" tabs={variantTabs} selected={variant?.id}>
            {variant && <p>{variant.description}</p>}
          </Tabs>
        )}

        {wrongVariant && (
          <p className={STYLES.missing}>
            {azphel
              ? `Azphel has one shared route for every class; “${variantId}” does not apply.`
              : `There is no “${variantId}” route. Pick one of the three routes above.`}
          </p>
        )}

        {board && (azphel || variant) && (
          <>
            <ul className={STYLES.notes}>
              {notes.map((note) => (
                <li key={note}>
                  <Diamond />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            {failed && (
              <div role="alert" className={STYLES.state}>
                <p>The board routes did not load.</p>
                <button type="button" onClick={retry}>
                  Try again
                </button>
              </div>
            )}

            {!failed && !data && (
              <p role="status" className={STYLES.state}>
                Loading the {board.name} board…
              </p>
            )}

            {data && (
              <BoardView
                key={`${board.id}/${variant?.id}`}
                geometry={data.geometry[board.id]}
                route={
                  azphel
                    ? data.azphel
                    : data.classRoutes.boards[board.id].routes[variant!.id]
                }
                phases={azphel ? data.azphel.phases : data.phases}
                skillMap={
                  azphel ? {} : data.classRoutes.boards[board.id].skills
                }
                skills={data.classRoutes.skills}
                rawPoints={rawPoints}
              />
            )}
          </>
        )}
      </Tabs>
    </section>
  );
}
