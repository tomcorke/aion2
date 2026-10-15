import { Link, useLocation } from "react-router";
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
  daevanionCaveats,
  daevanionClasses,
  daevanionReviewed,
  daevanionSources,
} from "../../data/daevanion.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Daevanion.module.css";

// ponytail: #16 adds the other seven classes here; their data already loads.
const viewerClasses = new Set(["spiritmaster"]);

const caveats = [daevanionCaveats.emptyBoard, daevanionCaveats.estimates];

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

  // Class tabs keep the board, variant and budget, so switching class keeps the view.
  const tail = selection.map((segment) => `/${segment}`).join("") + search;

  const tabs = daevanionClasses.map(({ id, name }) => ({
    id,
    label: name,
    to: `/daevanion/${id}${tail}`,
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

                {viewerClasses.has(entry.id) ? (
                  <RouteViewer
                    entry={entry}
                    boardId={boardId}
                    variantId={variantId}
                    rawPoints={new URLSearchParams(search).get("points")}
                  />
                ) : (
                  <p className={STYLES.missing}>
                    Board diagrams and purchase orders cover Spiritmaster for
                    now.{" "}
                    <Link to={`/daevanion/spiritmaster/azphel${search}`}>
                      The Azphel route
                    </Link>{" "}
                    is the same for every class.
                  </p>
                )}
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
