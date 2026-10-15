import { useLocation } from "react-router";
import { Tabs } from "../../components/controls/Tabs/Tabs.tsx";
import { AzphelRoute } from "../../components/daevanion/AzphelRoute/AzphelRoute.tsx";
import { RouteCosts } from "../../components/daevanion/RouteCosts/RouteCosts.tsx";
import { RouteViewer } from "../../components/daevanion/RouteViewer/RouteViewer.tsx";
import { SkillGroups } from "../../components/daevanion/SkillGroups/SkillGroups.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Diamond } from "../../components/trim/Diamond/Diamond.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  azphelOverview,
  daevanionBoards,
  daevanionCaveats,
  daevanionClasses,
  daevanionReviewed,
  daevanionSources,
  daevanionVariants,
  type DaevanionClass,
} from "../../data/daevanion.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { parseRouteBudget } from "../../lib/daevanionBudget.ts";
import STYLES from "./Daevanion.module.css";

const caveats = [daevanionCaveats.emptyBoard, daevanionCaveats.estimates];

const azphelTotal = azphelOverview.phases.at(-1)!.cumulativeCost;

/** A class tab keeps only a known board and route, and clamps the budget to that class's route. */
function classHref(
  target: DaevanionClass,
  [boardId, variantId]: string[],
  rawPoints: string | null,
) {
  const board = daevanionBoards.find(({ id }) => id === boardId)?.id;
  // Without a known board the link opens the class root, which shows Damage.
  const variant =
    (board && daevanionVariants.find(({ id }) => id === variantId)?.id) ||
    "damage";

  const pve = board && board !== "azphel" ? board : "nezekan";
  const total =
    board === "azphel" ? azphelTotal : target.routes[variant].boardCosts[pve];

  const { points } = parseRouteBudget(rawPoints, total);
  const query = points ? `?points=${points}` : "";
  let path = "";

  if (board === "azphel") path = "/azphel";
  else if (board) path = `/${board}/${variant}`;

  return `/daevanion/${target.id}${path}${query}`;
}

export function Daevanion() {
  useTitle("Daevanion");

  const { pathname, search } = useLocation();

  // /daevanion/:class/:board/:variant; missing segments fall back to the defaults.
  const [classId = "spiritmaster", ...selection] = pathname
    .split("/")
    .filter(Boolean)
    .slice(1);

  const [boardId = "nezekan", variantId] = selection;
  const entry = daevanionClasses.find(({ id }) => id === classId);
  const rawPoints = new URLSearchParams(search).get("points");

  const tabs = daevanionClasses.map((target) => ({
    id: target.id,
    label: target.name,
    to: classHref(target, selection, rawPoints),
  }));

  return (
    <>
      <PageHero
        title="Daevanion"
        lede="Point costs and skill roles on the four PvE boards for all eight classes, and the shared Azphel route."
      />

      <div className={STYLES.body}>
        <ul className={STYLES.caveats}>
          {caveats.map((caveat) => (
            <li key={caveat}>
              <Diamond />
              <span>{caveat}</span>
            </li>
          ))}
        </ul>

        <div>
          <Tabs label="Class" tabs={tabs} selected={entry?.id}>
            {entry ? (
              <div className={STYLES.panel}>
                {entry.id === "cleric" && (
                  <p className={STYLES.cleric}>{daevanionCaveats.cleric}</p>
                )}

                <RouteCosts entry={entry} />
                <SkillGroups entry={entry} />

                <RouteViewer
                  entry={entry}
                  boardId={boardId}
                  variantId={variantId}
                  rawPoints={rawPoints}
                />
              </div>
            ) : (
              <p className={STYLES.missing}>
                There is no “{classId}” class. Pick one of the eight classes
                above.
              </p>
            )}
          </Tabs>
        </div>

        <Rule gem />
        <AzphelRoute />
      </div>

      <SiteFooter sources={daevanionSources} reviewed={daevanionReviewed} />
    </>
  );
}
