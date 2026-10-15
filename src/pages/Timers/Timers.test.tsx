import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router";
import { beforeEach, expect, test } from "vitest";
import {
  freezeClock,
  NOW,
  renderWithProviders,
} from "../../testing/render.tsx";
import { Timers } from "./Timers.tsx";

function Back() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(-1)}>
      Back
    </button>
  );
}

const render = (path: string) =>
  renderWithProviders(
    <>
      <Timers />
      <Back />
    </>,
    { path },
  );

const spine = () => within(screen.getAllByRole("list")[1]);
const shows = (name: string) => spine().queryByText(name) !== null;

const setup = JSON.stringify({
  order: ["nahma", "weekly", "dartan"],
  hidden: ["kaira"],
  groups: ["fixed", "field"],
  minItemLevel: 0,
});

const kills = JSON.stringify({ dartan: NOW.getTime() });

beforeEach(() => {
  freezeClock();
  localStorage.setItem("timer-setup", setup);
  localStorage.setItem("timer-kills", kills);
});

test("shows the timer board under its title, with sources", () => {
  render("/timers");

  expect(
    screen.getByRole("heading", { level: 1, name: "Timers" }),
  ).toBeDefined();
  expect(screen.getByRole("region", { name: "Timers" })).toBeDefined();
  expect(screen.getByRole("contentinfo").textContent).toContain("couga54");
  expect(document.title).toBe("Timers · AION 2 Notes");
});

test("the root view keeps the saved groups", () => {
  render("/timers");

  expect(
    screen
      .getByRole("tab", { name: "All timers" })
      .getAttribute("aria-selected"),
  ).toBe("true");
  expect(shows("Weekly reset")).toBe(true);
  expect(shows("Executors")).toBe(false);
  expect(
    spine().getByText("Silent Dartan").closest("li")!.textContent,
  ).toContain("in 3h 00m");
});

test("/timers/abyss loads the Lower Reshanta view directly", () => {
  render("/timers/abyss");

  expect(
    screen
      .getByRole("tab", { name: "Lower Reshanta" })
      .getAttribute("aria-selected"),
  ).toBe("true");
  expect(shows("Guardian Lord Nahma")).toBe(true);
  expect(shows("Executors")).toBe(true);
  expect(shows("Watcher Kaira")).toBe(false);
  expect(shows("Weekly reset")).toBe(false);
  expect(document.title).toBe("Lower Reshanta timers · AION 2 Notes");
});

test("switching views and going back keeps the saved setup and kills", async () => {
  render("/timers");

  await userEvent.click(screen.getByRole("tab", { name: "Lower Reshanta" }));

  expect(shows("Executors")).toBe(true);
  expect(shows("Silent Dartan")).toBe(false);

  await userEvent.click(screen.getByRole("button", { name: "Back" }));

  expect(shows("Silent Dartan")).toBe(true);
  expect(shows("Executors")).toBe(false);
  expect(localStorage.getItem("timer-setup")).toBe(setup);
  expect(localStorage.getItem("timer-kills")).toBe(kills);
});

test("the shared clock warning shows in both views", async () => {
  render("/timers/abyss");

  expect(screen.getByText(/site assumption/)).toBeDefined();

  await userEvent.click(screen.getByRole("tab", { name: "All timers" }));

  expect(screen.getByText(/site assumption/)).toBeDefined();
});

test("an unknown view says so and shows the regular board", () => {
  render("/timers/upper");

  expect(screen.getByText(/no “upper” timer view/)).toBeDefined();
  expect(shows("Weekly reset")).toBe(true);
});
