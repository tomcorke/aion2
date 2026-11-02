import { useState } from "react";
import {
  usePreferences,
  type Faction,
} from "../../../preferences/preferences.ts";
import { timerDefs, type TimerGroup } from "../../../data/timers.ts";
import { timerClockWarning } from "../../../data/timerVerification.ts";
import { resolveTimer, type Kills } from "../../../lib/resolveTimer.ts";
import { useNow } from "../../../hooks/useNow.ts";
import { useStoredState } from "../../../hooks/useStoredState.ts";
import { FilterChips } from "../../controls/FilterChips/FilterChips.tsx";
import { TimerEditor } from "../TimerEditor/TimerEditor.tsx";
import { TimerNotes } from "../TimerNotes/TimerNotes.tsx";
import { TimerSpine } from "../TimerSpine/TimerSpine.tsx";
import { TimerWings } from "../TimerWings/TimerWings.tsx";
import { ZoneSwitch } from "../../controls/ZoneSwitch/ZoneSwitch.tsx";
import STYLES from "./TimerBoard.module.css";

type Setup = {
  order: string[];
  hidden: string[];
  groups: TimerGroup[];
  minItemLevel: number;
};

type MatchingGroup = 1 | 2 | 3;

const defaultSetup: Setup = {
  order: timerDefs.map(({ id }) => id),
  hidden: [],
  groups: ["fixed", "reshanta", "field"],
  minItemLevel: 0,
};

const groupLabels: Record<TimerGroup, string> = {
  fixed: "Fixed",
  reshanta: "Lower Reshanta",
  field: "Field bosses",
};

const itemLevels = [0, 46, 56, 70, 86];

const factionLabels: Record<Faction, string> = {
  elyos: "Elyos",
  asmodians: "Asmodians",
};

const eventTimerIds = ["siege", "executors", "nahma"];

function inView(
  timer: { group: TimerGroup; id: string },
  group: Props["group"],
  matchingGroup: MatchingGroup | 0,
  groups: TimerGroup[],
) {
  if (group === "abyss")
    return (
      (timer.group === "reshanta" || timer.id === "siege") &&
      (matchingGroup !== 0 || !eventTimerIds.includes(timer.id))
    );

  if (group) return timer.group === group;

  return groups.includes(timer.group);
}

function validMatchingGroup(value: number): MatchingGroup | 0 {
  if (value === 1 || value === 2 || value === 3) return value;

  return 0;
}

// Saved orders drop timers that no longer exist and gain any added since.
function fullOrder(saved: string[]) {
  const known = saved.filter((id) => timerDefs.some((def) => def.id === id));

  return [
    ...known,
    ...timerDefs.map(({ id }) => id).filter((id) => !known.includes(id)),
  ];
}

function toggled<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

type Props = {
  // A named group view, such as /timers/abyss. It replaces the group chips for this
  // render only; the saved groups, order, hidden timers and item level stay as they are.
  group?: TimerGroup | "abyss";
};

export function TimerBoard({ group }: Props) {
  const now = useNow();
  const { preferences, update } = usePreferences();
  const [stored, setSetup] = useStoredState("timer-setup", defaultSetup);
  const [kills, setKills] = useStoredState<Kills>("timer-kills", {});
  const [matchingGroup, setMatchingGroup] = useStoredState<MatchingGroup | 0>(
    "abyss-matching-group",
    0,
  );
  const [editing, setEditing] = useState(false);
  const pickedGroup = validMatchingGroup(matchingGroup);

  const setup = { ...defaultSetup, ...stored };
  const order = fullOrder(setup.order);

  const timers = order
    .map((id) => timerDefs.find((def) => def.id === id)!)
    .map((def) => {
      const matchingSchedule =
        group === "abyss" && pickedGroup
          ? def.matchingGroupSchedules?.[pickedGroup - 1]
          : undefined;

      return resolveTimer(
        matchingSchedule
          ? { ...def, schedule: { kind: "slots", ...matchingSchedule } }
          : def,
        now,
        preferences.faction,
        kills,
      );
    });

  const shown = timers.filter(
    (t) =>
      !setup.hidden.includes(t.id) &&
      inView(t, group, pickedGroup, setup.groups) &&
      (t.itemLevel ?? Infinity) >= setup.minItemLevel,
  );

  const emptyMessage = () => {
    if (!group)
      return "No timers to show. Turn on a timer group, pick a lower item level, or show timers under Edit timers.";

    const label = group === "abyss" ? "Lower Reshanta" : groupLabels[group];

    return `No ${label} timers to show: your hidden timers or item-level filter leave none. Use Edit timers or a lower item level below.`;
  };

  const change = (patch: Partial<Setup>) => setSetup({ ...setup, ...patch });
  const markKill = (id: string) => setKills({ ...kills, [id]: now.getTime() });

  const clearKill = (id: string) => {
    const rest = { ...kills };

    delete rest[id];
    setKills(rest);
  };

  const move = (id: string, step: -1 | 1) => {
    const next = [...order];
    const from = next.indexOf(id);

    [next[from], next[from + step]] = [next[from + step], next[from]];
    change({ order: next });
  };

  const layout = {
    timers: shown,
    now,
    onMarkKill: markKill,
    onClearKill: clearKill,
  };

  return (
    <section aria-label="Timers" className={STYLES.board}>
      <p className={STYLES.warning}>{timerClockWarning}</p>

      {group === "abyss" && (
        <div className={STYLES.matching}>
          <p>
            Reported times for Groups 1 / 2 / 3: Artifact Siege 21:00 / 21:05 /
            21:10, Executors 21:30 / 21:35 / 21:40, and Nahma 21:00 / 21:05 /
            21:10. Choose your server&apos;s matching group. Times use the
            provisional Berlin clock. Executors at 21:40 and Nahma at 21:10 were
            seen on one evening only; that does not confirm their recurring
            times.
          </p>
          <FilterChips
            label="Abyss matching group"
            chips={([1, 2, 3] as const).map((value) => ({
              value,
              label: `Group ${value}`,
              pressed: pickedGroup === value,
            }))}
            onToggle={setMatchingGroup}
          />
          {pickedGroup === 0 && (
            <p role="status">Choose a group to show these event countdowns.</p>
          )}
        </div>
      )}

      <div className={STYLES.wings}>
        <TimerWings {...layout} />
      </div>

      <div className={STYLES.spine}>
        <TimerSpine {...layout} />
      </div>

      {shown.length === 0 && !(group === "abyss" && pickedGroup === 0) && (
        <p role="status" className={STYLES.empty}>
          {emptyMessage()}
        </p>
      )}

      <div className={STYLES.toolbar}>
        <ZoneSwitch />

        {!group && (
          <FilterChips
            label="Timer groups"
            chips={(Object.keys(groupLabels) as TimerGroup[]).map((value) => ({
              value,
              label: groupLabels[value],
              pressed: setup.groups.includes(value),
            }))}
            onToggle={(value) =>
              change({ groups: toggled(setup.groups, value) })
            }
          />
        )}

        <FilterChips
          label="Minimum gear item level"
          chips={itemLevels.map((level) => ({
            value: level,
            label: level ? `${level}+` : "All",
            pressed: setup.minItemLevel === level,
          }))}
          onToggle={(level) => change({ minItemLevel: level })}
        />

        <FilterChips
          label="Field boss respawns for"
          chips={(Object.keys(factionLabels) as Faction[]).map((faction) => ({
            value: faction,
            label: factionLabels[faction],
            pressed: preferences.faction === faction,
          }))}
          onToggle={(faction) => update({ faction })}
        />

        <button
          type="button"
          className={STYLES.edit}
          aria-expanded={editing}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Done" : "Edit timers"}
        </button>
      </div>

      {editing && (
        <TimerEditor
          timers={timers}
          hidden={setup.hidden}
          onToggle={(id) => change({ hidden: toggled(setup.hidden, id) })}
          onMove={move}
        />
      )}

      <TimerNotes shown={shown.map(({ id }) => id)} />
    </section>
  );
}
