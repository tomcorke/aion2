import { Link } from "react-router";
import { resourceCounters } from "../../../data/alts.ts";
import { counterLimit } from "../../../lib/counterLimit.ts";
import { gearRewardConditions } from "../../../data/gear.ts";
import {
  growthTargets,
  type GrowthAcquisition,
  type GrowthMaterial,
} from "../../../data/growth.ts";
import STYLES from "./GrowthRow.module.css";

const kindLabels: Record<GrowthMaterial["kind"], string> = {
  material: "Upgrade material",
  currency: "Currency",
  equipment: "Equipment",
};

const scopeLabels = {
  character: "per character",
  server: "shared on the server",
};

const targetLabel = (id: string) =>
  growthTargets.find((target) => target.id === id)?.label;

// Route limits plus the shared counter and Gear reward rules they point at, never copies.
function limitsOf(route: GrowthAcquisition) {
  const counter = route.counterId && resourceCounters[route.counterId];

  const rules =
    gearRewardConditions.find(({ id }) => id === route.rewardConditionId)
      ?.notes ?? [];

  return [
    ...(route.limit ? [route.limit] : []),
    ...(counter
      ? [
          `${counter.name}: ${counterLimit(counter)}, ${scopeLabels[counter.scope]}.`,
        ]
      : []),
    ...rules,
  ];
}

function Route({ route }: { route: GrowthAcquisition }) {
  return (
    <li>
      {route.to ? (
        <Link to={route.to} className={STYLES.link}>
          {route.name}
        </Link>
      ) : (
        route.name
      )}
      {route.detail && <span className={STYLES.detail}>{route.detail}</span>}
    </li>
  );
}

function Limits({ material }: { material: GrowthMaterial }) {
  const limits = material.acquisition.flatMap((route) =>
    limitsOf(route).map((text) => ({ route: route.name, text })),
  );

  if (limits.length === 0 && !material.condition)
    return <p className={STYLES.muted}>No limit recorded.</p>;

  return (
    <>
      {limits.length > 0 && (
        <ul className={STYLES.list}>
          {limits.map(({ route, text }) => (
            <li key={`${route}-${text}`}>
              <span className={STYLES.route}>{route}</span> <span>{text}</span>
            </li>
          ))}
        </ul>
      )}
      {material.condition && (
        <p className={STYLES.condition}>{material.condition}</p>
      )}
    </>
  );
}

function Item({ material }: { material: GrowthMaterial }) {
  const pool =
    material.variant === "abyssal" ? "Abyssal pool" : "Ordinary pool";

  const facts = [
    material.tier,
    material.variant && pool,
    material.slots && `Slots: ${material.slots.join(", ")}`,
    material.aliases.length > 0 && `Also: ${material.aliases.join(", ")}`,
  ].filter(Boolean);

  return (
    <th scope="row" role="rowheader">
      <span className={STYLES.name}>{material.name}</span>
      <span className={STYLES[material.kind]}>{kindLabels[material.kind]}</span>
      {facts.map((fact) => (
        <span key={String(fact)} className={STYLES.fact}>
          {fact}
        </span>
      ))}
    </th>
  );
}

/** One material: what it grows, where more comes from, and what limits that supply. */
export function GrowthRow({ material }: { material: GrowthMaterial }) {
  const currency = material.kind === "currency";

  return (
    <tr role="row" className={currency ? STYLES.currencyRow : undefined}>
      <Item material={material} />
      <td role="cell" data-label="Grows">
        <span className={STYLES.targets}>
          {material.targets.map(targetLabel).join(" · ")}
        </span>
        <p>{material.use}</p>
        {material.links.map((link) => (
          <Link key={link.to + link.label} to={link.to} className={STYLES.link}>
            {link.label}
          </Link>
        ))}
      </td>
      <td role="cell" data-label="From">
        <ul className={STYLES.list}>
          {material.acquisition.map((route) => (
            <Route key={route.name} route={route} />
          ))}
        </ul>
      </td>
      <td role="cell" data-label="Limits and conditions">
        <Limits material={material} />
      </td>
    </tr>
  );
}
