import { Fragment, useId } from "react";
import { Link } from "react-router";
import {
  gearActivities,
  gearDrops,
  gearTiers,
  type GearActivity,
  type GearMode,
  type GearTier,
} from "../../../data/gear.ts";
import { GearName } from "../GearName/GearName.tsx";
import STYLES from "./GateTrack.module.css";

const number = new Intl.NumberFormat("en-GB");

type Gate = { total: number; activity: GearActivity; mode: GearMode };

// Entry modes that drop this tier's gear and have a recorded total gate, lowest first.
function gatesOf(tier: GearTier): Gate[] {
  const tierDropIds = new Set(
    gearDrops.filter((drop) => drop.tierId === tier.id).map(({ id }) => id),
  );

  return gearActivities
    .filter((activity) => tier.entryActivityIds.includes(activity.id))
    .flatMap((activity) =>
      activity.modes
        .filter((mode) => mode.dropIds.some((id) => tierDropIds.has(id)))
        .flatMap((mode) =>
          mode.totalItemLevel === undefined
            ? []
            : [{ total: mode.totalItemLevel, activity, mode }],
        ),
    )
    .sort((a, b) => a.total - b.total);
}

// Starter has no single piece level, so show the span of its drops.
function pieceLevelOf(tier: GearTier) {
  if (tier.pieceItemLevel !== undefined) return String(tier.pieceItemLevel);

  const levels = gearDrops
    .filter((drop) => drop.tierId === tier.id)
    .flatMap(({ pieceItemLevel: level }) =>
      typeof level === "number" ? [level] : Object.values(level),
    );

  return `${Math.min(...levels)}–${Math.max(...levels)}`;
}

function GateList({ gates }: { gates: Gate[] }) {
  return gates.map(({ activity, mode }, index) => (
    <Fragment key={activity.id + mode.name}>
      {index > 0 && ", "}
      <GearName name={activity.name} /> {mode.name}
    </Fragment>
  ));
}

/** The selected tier's piece level, the total gate that opens it, and the next step. */
export function GateTrack({ tier }: { tier: GearTier }) {
  const id = useId();
  const gates = gatesOf(tier);
  const next = gearTiers.find(({ id: tierId }) => tierId === tier.nextTierId);
  const nextGate = next && gatesOf(next)[0];

  const sources = gearActivities.filter((activity) =>
    tier.entryActivityIds.includes(activity.id),
  );

  return (
    <section aria-labelledby={`${id}-heading`} className={STYLES.track}>
      <h2 id={`${id}-heading`}>Gate track</h2>

      <p className={STYLES.note}>
        Total item level is the sum on your character and opens content. Each
        piece also has its own item level; the tiers here are piece levels.
      </p>

      <dl className={STYLES.steps}>
        <dt id={`${id}-piece`}>Piece item level</dt>
        <dd aria-labelledby={`${id}-piece`} className={STYLES.level}>
          {pieceLevelOf(tier)}
        </dd>

        <dt id={`${id}-from`}>Main sources</dt>
        <dd aria-labelledby={`${id}-from`}>
          {sources.map((activity, index) => (
            <Fragment key={activity.id}>
              {index > 0 && ", "}
              <GearName name={activity.name} />
            </Fragment>
          ))}
        </dd>

        {gates.length > 0 && (
          <>
            <dt id={`${id}-gate`}>Opens at total item level</dt>
            <dd aria-labelledby={`${id}-gate`}>
              <span className={STYLES.level}>
                {number.format(gates[0].total)}
              </span>{" "}
              <GateList gates={gates} />
            </dd>
          </>
        )}

        {next && (
          <>
            <dt id={`${id}-next`}>Next tier</dt>
            <dd aria-labelledby={`${id}-next`}>
              {next.label} pieces
              {nextGate && (
                <>
                  , from total item level{" "}
                  <span className={STYLES.level}>
                    {number.format(nextGate.total)}
                  </span>
                </>
              )}
            </dd>
          </>
        )}
      </dl>

      <p>
        <Link to="/progression" className={STYLES.link}>
          Full route ladder on Progression →
        </Link>
      </p>
    </section>
  );
}
