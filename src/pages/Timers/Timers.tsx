import { useMatch } from "react-router";
import { Tabs } from "../../components/controls/Tabs/Tabs.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { TimerBoard } from "../../components/timers/TimerBoard/TimerBoard.tsx";
import { timerSources } from "../../data/timers.ts";
import { timerVerificationSources } from "../../data/timerVerification.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Timers.module.css";

// Named views show one group without touching the reader's saved setup.
const tabs = [
  { id: "all", label: "All timers", to: "/timers" },
  { id: "abyss", label: "Lower Reshanta", to: "/timers/abyss" },
];

const sources = [...new Set([...timerSources, ...timerVerificationSources])];

export function Timers() {
  const view = useMatch("/timers/:view")?.params.view;
  const abyss = view === "abyss";

  useTitle(abyss ? "Lower Reshanta timers" : "Timers");

  return (
    <>
      <PageHero
        title="Timers"
        lede="Resets, rifts, Lower Reshanta bosses and field boss respawns. Field bosses count from the kill you mark."
      />

      <div className={STYLES.views}>
        <Tabs
          label="Timer views"
          tabs={tabs}
          selected={view ? tabs.find(({ id }) => id === view)?.id : "all"}
        >
          {view && !abyss && (
            <p className={STYLES.missing}>
              There is no “{view}” timer view. Showing your regular timers.
            </p>
          )}

          <TimerBoard group={abyss ? "reshanta" : undefined} />
        </Tabs>
      </div>

      <SiteFooter sources={sources} reviewed="2026-10-14" />
    </>
  );
}
