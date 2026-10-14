import { Link, useMatch } from "react-router";
import { FilterChips } from "../../components/controls/FilterChips/FilterChips.tsx";
import { Tabs } from "../../components/controls/Tabs/Tabs.tsx";
import { DropMatrix } from "../../components/gear/DropMatrix/DropMatrix.tsx";
import { GateTrack } from "../../components/gear/GateTrack/GateTrack.tsx";
import { PityTable } from "../../components/gear/PityTable/PityTable.tsx";
import { TierDrops } from "../../components/gear/TierDrops/TierDrops.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import { gearReviewed, gearSources, gearTiers } from "../../data/gear.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { usePreferences, type Faction } from "../../preferences/preferences.ts";
import STYLES from "./Gear.module.css";

const factions: { value: Faction; label: string }[] = [
  { value: "elyos", label: "Elyos" },
  { value: "asmodians", label: "Asmodians" },
];

// Starter is the root, so /gear needs no saved character level.
const tabs = gearTiers.map(({ id, label }) => ({
  id,
  label,
  to: id === "starter" ? "/gear" : `/gear/${id}`,
}));

export function Gear() {
  useTitle("Gear");

  const { preferences, update } = usePreferences();
  const tierId = useMatch("/gear/:tier")?.params.tier ?? "starter";
  const tier = gearTiers.find(({ id }) => id === tierId);

  return (
    <>
      <PageHero
        title="Gear"
        lede="Where each piece item level drops, what opens it, and how pity counts."
      />

      <div className={STYLES.body}>
        <div className={STYLES.toolbar}>
          <span className={STYLES.label}>Crafting names</span>
          <FilterChips
            label="Faction"
            chips={factions.map(({ value, label }) => ({
              value,
              label,
              pressed: preferences.faction === value,
            }))}
            onToggle={(faction) => update({ faction })}
          />
          <Link to="/gear/enhancement" className={STYLES.upgrades}>
            Enhancement and upgrades →
          </Link>
        </div>

        <div>
          <Tabs label="Piece item level tier" tabs={tabs} selected={tier?.id}>
            {tier ? (
              <div className={STYLES.tier}>
                <GateTrack tier={tier} />
                <TierDrops tierId={tier.id} />
              </div>
            ) : (
              <p className={STYLES.missing}>
                There is no “{tierId}” gear tier. Pick a tier above.
              </p>
            )}
          </Tabs>
        </div>

        <Rule gem />
        <DropMatrix />
        <Rule gem />
        <PityTable />
      </div>

      <SiteFooter sources={gearSources} reviewed={gearReviewed} />
    </>
  );
}
