import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { ZoneSwitch } from "./ZoneSwitch.tsx";

test("starts on server time and switches zone", async () => {
  renderWithProviders(<ZoneSwitch />);

  expect(
    screen.getByRole("button", { name: "Server" }).getAttribute("aria-pressed"),
  ).toBe("true");

  await userEvent.click(screen.getByRole("button", { name: "UTC" }));

  expect(
    screen.getByRole("button", { name: "UTC" }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen.getByRole("button", { name: "Server" }).getAttribute("aria-pressed"),
  ).toBe("false");
});
