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

test("explains Spacetime Rift entry and stay limits with faction context", () => {
  renderWithProviders(<TimerNotes shown={["rift"]} />);

  const notes = screen.getByRole("list", { name: "Timer notes" }).textContent;

  expect(notes).toContain("level 45 or higher");
  expect(notes).toContain("your faction's portal");
  expect(notes).toContain("Elyos can start the quests from Mino");
  expect(notes).toContain("Asmodians can start theirs from Uru");
  expect(notes).toContain("portal stays open for 10 minutes");
  expect(notes).toContain("after entry, your stay lasts one hour");
});
