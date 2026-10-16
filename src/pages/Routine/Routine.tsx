import { Link } from "react-router";
import { RoutineGroup } from "../../components/routine/RoutineGroup/RoutineGroup.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Diamond } from "../../components/trim/Diamond/Diamond.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  bankingReminders,
  routineContract,
  routineReviewed,
  routineSources,
  routineTasks,
  type RoutineGroup as Group,
} from "../../data/routine.ts";
import { useStoredState } from "../../hooks/useStoredState.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { toggleOwned, validOwned } from "../../lib/skinOwnership.ts";
import STYLES from "./Routine.module.css";

const known = new Set(routineTasks.map(({ id }) => id));

const groups = [
  { group: "daily", title: "Daily" },
  { group: "weekly", title: "Weekly" },
] as const;

export function Routine() {
  useTitle("Routine");

  // Its own key: clearing never touches timers, preferences or skin ownership.
  const [stored, setStored] = useStoredState<string[]>("routine-ticks", []);
  const ticks = validOwned(stored, known);

  const toggle = (id: string) =>
    setStored((current) => toggleOwned(validOwned(current, known), id));

  const clear = (group: Group) =>
    setStored((current) =>
      validOwned(current, known).filter(
        (id) => routineTasks.find((task) => task.id === id)?.group !== group,
      ),
    );

  return (
    <>
      <PageHero
        title="Routine"
        lede="Daily and weekly reminders with their limits and sharing scope, cleared only when you choose."
      />

      <div className={STYLES.body}>
        <p className={STYLES.note}>{routineContract}</p>

        <div className={STYLES.groups}>
          {groups.map(({ group, title }) => (
            <RoutineGroup
              key={group}
              title={title}
              tasks={routineTasks.filter((task) => task.group === group)}
              ticks={ticks}
              onToggle={toggle}
              onClear={() => clear(group)}
            />
          ))}
        </div>

        <Rule gem />

        <section aria-labelledby="routine-banking" className={STYLES.prose}>
          <h2 id="routine-banking" className={STYLES.heading}>
            Banking and refills
          </h2>
          <ul className={STYLES.reminders}>
            {bankingReminders.map((reminder) => (
              <li key={reminder}>
                <Diamond />
                <span>{reminder}</span>
              </li>
            ))}
          </ul>
          <Link to="/timers" className={STYLES.link}>
            Timers and reset schedules
          </Link>
        </section>
      </div>

      <SiteFooter sources={routineSources} reviewed={routineReviewed} />
    </>
  );
}
