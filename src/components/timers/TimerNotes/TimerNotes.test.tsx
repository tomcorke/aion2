import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { TimerNotes } from "./TimerNotes.tsx";

test("renders nothing with no timers on show", () => {
  renderWithProviders(<TimerNotes shown={[]} />);

  expect(screen.queryByRole("list")).toBeNull();
});

test("lists one note for a group of timers it covers", () => {
  renderWithProviders(<TimerNotes shown={["kaira", "nahma", "weekly"]} />);

  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByRole("listitem").textContent).toContain(
    "Argo, the Spirit King's spawn rule is unknown",
  );
});
