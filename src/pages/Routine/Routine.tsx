import { Link } from "react-router";
import { format } from "date-fns";
import { tz } from "@date-fns/tz";
import { EventReminderGroup } from "../../components/routine/EventReminderGroup/EventReminderGroup.tsx";
import { RoutineGroup } from "../../components/routine/RoutineGroup/RoutineGroup.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Diamond } from "../../components/trim/Diamond/Diamond.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  bankingReminders,
  activeRoutineEventReminders,
  routineEventReminders,
  routineContract,
  routineReviewed,
  routineSources,
  routineTasks,
  type RoutineGroup as Group,
} from "../../data/routine.ts";
import { useStoredState } from "../../hooks/useStoredState.ts";
import { useNow } from "../../hooks/useNow.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { toggleOwned, validOwned } from "../../lib/skinOwnership.ts";
import { SERVER_ZONE } from "../../lib/time.ts";
import STYLES from "./Routine.module.css";

const known = new Set(routineTasks.map(({ id }) => id));
const knownEventReminders = new Set(routineEventReminders.map(({ id }) => id));

const groups = [
  { group: "daily", title: "Daily" },
  { group: "weekly", title: "Weekly" },
] as const;

export function Routine() {
  useTitle("Routine");
  const now = useNow(60_000);

  // Its own key: clearing never touches timers, preferences or skin ownership.
  const [stored, setStored] = useStoredState<string[]>("routine-ticks", []);
  const ticks = validOwned(stored, known);
  const [storedEventTicks, setStoredEventTicks] = useStoredState<string[]>(
    "routine-event-ticks",
    [],
  );
  const eventReminders = activeRoutineEventReminders(
    format(now, "yyyy-MM-dd", { in: tz(SERVER_ZONE) }),
  );
  const visibleEventIds = new Set(eventReminders.map(({ id }) => id));
  const eventTicks = validOwned(storedEventTicks, knownEventReminders).filter(
    (id) => visibleEventIds.has(id),
  );

  const toggle = (id: string) =>
    setStored((current) => toggleOwned(validOwned(current, known), id));

  const clear = (group: Group) =>
    setStored((current) =>
      validOwned(current, known).filter(
        (id) => routineTasks.find((task) => task.id === id)?.group !== group,
      ),
    );

  const toggleEvent = (id: string) =>
    setStoredEventTicks((current) =>
      toggleOwned(validOwned(current, knownEventReminders), id),
    );

  const clearEventReminders = () =>
    setStoredEventTicks((current) =>
      validOwned(current, knownEventReminders).filter(
        (id) => !visibleEventIds.has(id),
      ),
    );

  return (
    <>
      <PageHero
        title="Routine"
        lede="Selected daily and weekly reminders; this is not an exhaustive list. Tick them when you choose."
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

        {eventReminders.length > 0 && (
          <EventReminderGroup
            reminders={eventReminders}
            ticks={eventTicks}
            onToggle={toggleEvent}
            onClear={clearEventReminders}
          />
        )}

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
