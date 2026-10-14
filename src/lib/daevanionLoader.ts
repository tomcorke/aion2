import { daevanionClasses } from "../data/daevanion.ts";

/** Stateless Promise API: the viewer owns loading, retry and ignoring obsolete requests. */
export async function loadClassRoutes(classId: string) {
  const entry = daevanionClasses.find((candidate) => candidate.id === classId);

  if (!entry) throw new Error(`Unknown Daevanion class: ${classId}`);

  // Native module loading shares geometry and successful loads; do not cache a
  // rejected Promise or hold a global selected class. Calling again can retry.
  const { daevanionRouteData: data } =
    await import("../data/daevanionRoutes.ts");

  return {
    classId: entry.id,
    geometry: data.boards,
    classRoutes: data.classes[entry.id],
    azphel: data.azphel,
    phases: data.phases,
    provenance: data.provenance,
  };
}
