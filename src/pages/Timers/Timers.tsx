import { PageHero } from "../../components/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/SiteFooter/SiteFooter.tsx";
import { TimerBoard } from "../../components/TimerBoard/TimerBoard.tsx";
import { timerSources } from "../../timers.ts";
import { useTitle } from "../../useTitle.ts";

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
