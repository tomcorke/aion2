import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { daevanionClasses } from "../../../data/daevanion.ts";
import { loadClassRoutes } from "../../../lib/daevanionLoader.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { RouteViewer } from "./RouteViewer.tsx";

vi.mock("../../../lib/daevanionLoader.ts", async (original) => {
  const actual =
    await original<typeof import("../../../lib/daevanionLoader.ts")>();

  return { loadClassRoutes: vi.fn(actual.loadClassRoutes) };
});

const load = vi.mocked(loadClassRoutes);
const actual = load.getMockImplementation()!;

const byId = (id: string) => daevanionClasses.find((entry) => entry.id === id)!;

// The page only routes Spiritmaster here for now, but the viewer must not mix classes.
function Harness() {
  const [classId, setClassId] = useState("spiritmaster");

  return (
    <>
      <button type="button" onClick={() => setClassId("cleric")}>
        Cleric
      </button>
      <RouteViewer
        entry={byId(classId)}
        boardId="nezekan"
        variantId="damage"
        rawPoints={null}
      />
    </>
  );
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => (resolve = done));

  return { promise, resolve };
}

beforeEach(() => {
  load.mockReset();
  load.mockImplementation(actual);
});

test("shows loading, then a failure with a retry that loads the board", async () => {
  load.mockRejectedValueOnce(new Error("offline"));
  renderWithProviders(<Harness />);

  expect(screen.getByRole("status").textContent).toBe(
    "Loading the Nezekan board…",
  );

  const alert = await screen.findByRole("alert");

  expect(alert.textContent).toMatch(/did not load/);
  expect(screen.queryByRole("group", { name: /board diagram/ })).toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "Try again" }));

  expect(
    await screen.findByRole("group", { name: "Nezekan board diagram" }),
  ).toBeDefined();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(load).toHaveBeenCalledTimes(2);
});

test("a late result for an earlier class never replaces the current class", async () => {
  const late = deferred();
  let lateResult: Promise<unknown> = Promise.resolve();

  load.mockImplementation((classId) => {
    if (classId !== "spiritmaster") return actual(classId);

    const result = late.promise.then(() => actual(classId));

    lateResult = result;

    return result;
  });

  renderWithProviders(<Harness />);
  await userEvent.click(screen.getByRole("button", { name: "Cleric" }));

  const clericNode = await screen.findByRole("button", {
    name: /^Row 5, column 3: Warm Benediction/,
  });

  // The viewer's handler was attached first, so it has run once this settles.
  await act(async () => {
    late.resolve();
    await lateResult;
  });

  expect(clericNode.isConnected).toBe(true);
  expect(
    screen.queryByRole("button", { name: /^Row 5, column 3: Spirit Strike/ }),
  ).toBeNull();
});

test("a class switch hides the previous diagram until the new class loads", async () => {
  const pending = deferred();

  renderWithProviders(<Harness />);
  await screen.findByRole("button", {
    name: /^Row 5, column 3: Spirit Strike/,
  });

  load.mockImplementation(async (classId) => {
    await pending.promise;

    return actual(classId);
  });

  await userEvent.click(screen.getByRole("button", { name: "Cleric" }));

  expect(screen.getByRole("status").textContent).toMatch(/Loading/);
  expect(
    screen.queryByRole("button", { name: /^Row 5, column 3: Spirit Strike/ }),
  ).toBeNull();

  pending.resolve();

  expect(
    await screen.findByRole("button", {
      name: /^Row 5, column 3: Warm Benediction/,
    }),
  ).toBeDefined();
});
