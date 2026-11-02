import { useMatch } from "react-router";
import { Tabs } from "../../components/controls/Tabs/Tabs.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { TimerBoard } from "../../components/timers/TimerBoard/TimerBoard.tsx";
import { timerReviewed } from "../../data/timers.ts";
import { timerPageSources } from "../../data/timerVerification.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Timers.module.css";

// Named views show one group without touching the reader's saved setup.
const tabs = [
  { id: "all", label: "All timers", to: "/timers" },
  { id: "abyss", label: "Lower Reshanta", to: "/timers/abyss" },
];

export function Timers() {
  const view = useMatch("/timers/:view")?.params.view;
  const abyss = view === "abyss";

  useTitle(abyss ? "Lower Reshanta timers" : "Timers");

  return (
    <>
      <PageHero
        title="Timers"
        lede="Resets, rifts and Lower Reshanta bosses. Field boss respawns are tracked for four gear targets: Gartua, Lagta, Kashapa and Dartan. Mark a kill to start each timer."
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

          <TimerBoard group={abyss ? "abyss" : undefined} />
        </Tabs>
      </div>

      <SiteFooter sources={timerPageSources} reviewed={timerReviewed} />
    </>
  );
}
