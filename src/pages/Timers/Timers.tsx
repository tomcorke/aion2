import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { TimerBoard } from "../../components/timers/TimerBoard/TimerBoard.tsx";
import { timerSources } from "../../data/timers.ts";
import { useTitle } from "../../hooks/useTitle.ts";

export function Timers() {
  useTitle("Timers");

  return (
    <>
      <PageHero
        title="Timers"
        lede="Resets, rifts, Lower Reshanta bosses and field boss respawns. Field bosses count from the kill you mark."
      />
      <TimerBoard />
      <SiteFooter sources={timerSources} reviewed="2026-10-14" />
    </>
  );
}
