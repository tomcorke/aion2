import { useMatch } from "react-router";
import { Tabs } from "../../components/controls/Tabs/Tabs.tsx";
import { AzphelRoute } from "../../components/daevanion/AzphelRoute/AzphelRoute.tsx";
import { RouteCosts } from "../../components/daevanion/RouteCosts/RouteCosts.tsx";
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

const tabs = daevanionClasses.map(({ id, name }) => ({
  id,
  label: name,
  to: `/daevanion/${id}`,
}));

const caveats = [daevanionCaveats.emptyBoard, daevanionCaveats.estimates];

export function Daevanion() {
  useTitle("Daevanion");

  // ponytail: extra path segments are ignored until the board viewer (#15) claims them.
  const classId =
    useMatch("/daevanion/:class/*")?.params.class ?? "spiritmaster";

  const entry = daevanionClasses.find(({ id }) => id === classId);

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
