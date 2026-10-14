import { expect, test, vi } from "vitest";
import { loadClassRoutes } from "./daevanionLoader.ts";

const evaluated = vi.hoisted(() => vi.fn());

vi.mock("../data/daevanionRoutes.ts", async (importOriginal) => {
  evaluated();

  return importOriginal();
});

test("the loader imports no heavy data until a valid class is requested", async () => {
  expect(evaluated).not.toHaveBeenCalled();
  await expect(loadClassRoutes("unknown")).rejects.toThrow(
    "Unknown Daevanion class",
  );
  await expect(loadClassRoutes("__proto__")).rejects.toThrow(
    "Unknown Daevanion class",
  );
  expect(evaluated).not.toHaveBeenCalled();

  const result = await loadClassRoutes("spiritmaster");

  expect(evaluated).toHaveBeenCalledOnce();
  expect(result.classId).toBe("spiritmaster");
  expect(result.classRoutes.name).toBe("Spiritmaster");
  expect(result.classRoutes.boards.nezekan.routes.damage.total).toBe(107);
  expect(result.geometry.azphel.total).toBe(232);
  expect(result.azphel.variantId).toBe("hp-mp-first");
  expect(result.azphel.total).toBe(114);
});

test("concurrent selections return their own class identity and one shared geometry/Azphel reference", async () => {
  const [cleric, chanter, spiritmaster] = await Promise.all([
    loadClassRoutes("cleric"),
    loadClassRoutes("chanter"),
    loadClassRoutes("spiritmaster"),
  ]);

  expect(cleric.classId).toBe("cleric");
  expect(cleric.classRoutes.name).toBe("Cleric");
  expect(cleric.classRoutes.boards.vaizel.routes.damage.total).toBe(83);
  expect(chanter.classId).toBe("chanter");
  expect(chanter.classRoutes.name).toBe("Chanter");
  expect(chanter.classRoutes.boards.zikel.routes.defense.total).toBe(101);
  expect(spiritmaster.classId).toBe("spiritmaster");
  expect(cleric.geometry).toBe(chanter.geometry);
  expect(chanter.geometry).toBe(spiritmaster.geometry);
  expect(cleric.azphel).toBe(chanter.azphel);
  expect(chanter.azphel).toBe(spiritmaster.azphel);
  expect(await loadClassRoutes("cleric")).toEqual(cleric);
});
