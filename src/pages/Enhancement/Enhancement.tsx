import type { ReactNode } from "react";
import { Link } from "react-router";
import { UpgradeRates } from "../../components/gear/UpgradeRates/UpgradeRates.tsx";
import { UpgradeSection } from "../../components/gear/UpgradeSection/UpgradeSection.tsx";
import { UpgradeStones } from "../../components/gear/UpgradeStones/UpgradeStones.tsx";
import { ContentsRail } from "../../components/progression/ContentsRail/ContentsRail.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  gearUpgradeSections,
  gearUpgradesReviewed,
  gearUpgradesSources,
} from "../../data/gearUpgrades.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Enhancement.module.css";

// Tables shown inside the section they explain.
const tables: Record<string, ReactNode> = {
  enhancement: <UpgradeRates track="enhancement" />,
  amplification: <UpgradeRates track="amplification" />,
  engraving: <UpgradeStones />,
};

/** Upgrade guidance at /gear/enhancement, beside the tier browser at /gear. */
export function Enhancement() {
  useTitle("Gear upgrades");

  return (
    <>
      <PageHero
        title="Gear upgrades"
        lede="Enhancement, what each upgrade keeps or loses, and power from outside your gear."
      />

      <div className={STYLES.body}>
        <div className={STYLES.side}>
          <Link to="/gear" className={STYLES.back}>
            ← Gear tiers and drops
          </Link>
          <ContentsRail entries={gearUpgradeSections} />
        </div>

        <div className={STYLES.guide}>
          {gearUpgradeSections.map((section, i) => (
            <div key={section.id} className={STYLES.part}>
              {i > 0 && <Rule gem />}
              <UpgradeSection section={section}>
                {tables[section.id]}
              </UpgradeSection>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter
        sources={gearUpgradesSources}
        reviewed={gearUpgradesReviewed}
      />
    </>
  );
}
