import type { Zone } from "./preferences.ts";

// The EU server clock. Boss timers seen in game fit Central European time, but the region's
// true server zone is an open question in the notes repo; change it here if that resolves.
export const SERVER_ZONE = "Europe/Berlin";

const DAY = 86_400;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const zoneTimeZones: Record<Zone, string | undefined> = {
  server: SERVER_ZONE,
  local: undefined,
  utc: "UTC",
};

function format(
  timeZone: string | undefined,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    ...options,
  });
}

// Weekday (0 = Sunday) and seconds since midnight on the server clock.
function serverClock(now: Date) {
  const parts = Object.fromEntries(
    format(SERVER_ZONE, {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );

  return {
    weekday: WEEKDAYS.indexOf(parts.weekday),
    seconds:
      Number(parts.hour) * 3600 +
      Number(parts.minute) * 60 +
      Number(parts.second),
  };
}

// ponytail: counts in server wall-clock seconds, so a countdown that spans a daylight-saving
// change is an hour out until the change passes.

/** Seconds until the next server-time hour:minute, optionally only on the given weekdays. */
export function secondsUntil(
  now: Date,
  hour: number,
  minute: number,
  days?: number[],
) {
  const { weekday, seconds } = serverClock(now);

  for (let ahead = 0; ahead <= 7; ahead++) {
    const left = ahead * DAY + hour * 3600 + minute * 60 - seconds;

    if (left > 0 && (!days || days.includes((weekday + ahead) % 7)))
      return left;
  }

  return 7 * DAY;
}

/** Seconds until the next slot of a repeating server-time schedule. */
export function secondsUntilEvery(
  now: Date,
  startHour: number,
  startMinute: number,
  everyHours: number,
) {
  const step = everyHours * 3600;
  const left =
    (startHour * 3600 + startMinute * 60 - serverClock(now).seconds) % step;

  return left > 0 ? left : left + step;
}

/** "3d 4h", "3h 07m" or "12m 05s". */
export function formatCountdown(seconds: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;

  if (hours > 0) return `${hours}h ${pad(minutes)}m`;

  return `${minutes}m ${pad(Math.floor(seconds % 60))}s`;
}

/** Weekday and clock time, in the reader's chosen zone. */
export function formatAt(date: Date, zone: Zone) {
  return format(zoneTimeZones[zone], {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatServerClock(now: Date) {
  return format(SERVER_ZONE, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
}
