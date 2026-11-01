import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { PetControls } from "./PetControls.tsx";

function renderControls() {
  const handlers = {
    onQuery: vi.fn(),
    onToggleType: vi.fn(),
    onToggleHideMaxed: vi.fn(),
    onToggleMaxOnly: vi.fn(),
    onToggleMapOption: vi.fn(),
    onSelectAll: vi.fn(),
    onSelectNone: vi.fn(),
  };

  render(
    <PetControls
      query=""
      types={new Set(["Cogni"])}
      hideMaxed={false}
      maxOnly
      mapOptions={new Set(["heat"])}
      shown={12}
      selected={3}
      {...handlers}
    />,
  );

  return handlers;
}

test("shows the chosen filters and map overlays as pressed", () => {
  renderControls();

  expect(
    screen.getByRole("button", { name: "Cogni" }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen.getByRole("button", { name: "Fera" }).getAttribute("aria-pressed"),
  ).toBe("false");
  expect(
    screen
      .getByRole("button", { name: "Level 3 box only" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "Heatmap of pets left" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "Highlight best area" })
      .getAttribute("aria-pressed"),
  ).toBe("false");
  expect(screen.getByRole("status").textContent).toContain("3 selected");
});

test("reports every control", async () => {
  const handlers = renderControls();

  await userEvent.type(
    screen.getByRole("searchbox", { name: "Search pets" }),
    "a",
  );
  await userEvent.click(screen.getByRole("button", { name: "Natura" }));
  await userEvent.click(
    screen.getByRole("button", { name: "Hide level 3 pets" }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Level 3 box only" }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Highlight best area" }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Select all shown (12)" }),
  );
  await userEvent.click(screen.getByRole("button", { name: "Select none" }));

  expect(handlers.onQuery).toHaveBeenCalledWith("a");
  expect(handlers.onToggleType).toHaveBeenCalledWith("Natura");
  expect(handlers.onToggleHideMaxed).toHaveBeenCalledTimes(1);
  expect(handlers.onToggleMaxOnly).toHaveBeenCalledTimes(1);
  expect(handlers.onToggleMapOption).toHaveBeenCalledWith("best");
  expect(handlers.onSelectAll).toHaveBeenCalled();
  expect(handlers.onSelectNone).toHaveBeenCalled();
});
