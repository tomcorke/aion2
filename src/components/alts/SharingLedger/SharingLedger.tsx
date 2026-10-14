import { useId, type ReactNode } from "react";
import {
  resourceCounters,
  sharingLedger,
  type SharingEntry,
} from "../../../data/alts.ts";
import { counterLimit } from "../../../lib/counterLimit.ts";
import STYLES from "./SharingLedger.module.css";

const serverCounters = Object.values(resourceCounters).filter(
  (counter) => counter.scope === "server",
);

const entriesIn = (scope: SharingEntry["scope"]) =>
  sharingLedger.filter((entry) => entry.scope === scope);

function Entries({ scope }: { scope: SharingEntry["scope"] }) {
  const prefix = useId();

  return (
    <ul className={STYLES.entries}>
      {entriesIn(scope).map(({ id, name, details }) => (
        <li key={id} aria-labelledby={`${prefix}${id}`}>
          <h4 id={`${prefix}${id}`}>{name}</h4>
          <p>{details}</p>
        </li>
      ))}
    </ul>
  );
}

function Column({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <section aria-labelledby={id} className={className}>
      <h3 id={id}>{title}</h3>
      {children}
    </section>
  );
}

/** Same-server sharing against each character, then the server pools and another server. */
export function SharingLedger() {
  return (
    <div className={STYLES.ledger}>
      <div className={STYLES.side}>
        <Column title="Shared on the same server">
          <Entries scope="same-server" />
        </Column>

        <Column title="Shared reward pools">
          <Entries scope="server-pool" />
          <ul className={STYLES.limits}>
            {serverCounters.map((counter) => (
              <li key={counter.name}>
                {`${counter.name}: ${counterLimit(counter)}`}
              </li>
            ))}
          </ul>
        </Column>
      </div>

      <Column title="Each character" className={STYLES.side}>
        <Entries scope="character" />
      </Column>

      <Column title="Another server" className={STYLES.other}>
        <Entries scope="another-server" />
      </Column>
    </div>
  );
}
