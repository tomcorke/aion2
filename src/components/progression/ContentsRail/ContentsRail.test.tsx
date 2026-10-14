import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ContentsRail } from "./ContentsRail.tsx";

const entries = [
  { id: "one", title: "One" },
  { id: "two", title: "Two" },
];

test("scrolls to and focuses the chosen heading", async () => {
  render(
    <>
      <ContentsRail entries={entries} />
      <h2 id="two" tabIndex={-1}>
        Two
      </h2>
    </>,
  );

  const heading = screen.getByRole("heading", { name: "Two" });

  heading.scrollIntoView = vi.fn();

  await userEvent.click(screen.getByRole("button", { name: "Two" }));

  expect(heading.scrollIntoView).toHaveBeenCalled();
  expect(document.activeElement).toBe(heading);
});
