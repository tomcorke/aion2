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

test("keeps zone buttons keyboard-accessible and saves the selected zone", async () => {
  renderWithProviders(<ZoneSwitch />);

  await userEvent.tab();
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Server" }),
  );

  await userEvent.tab();
  const local = screen.getByRole("button", { name: "Local" });

  expect(document.activeElement).toBe(local);

  await userEvent.keyboard("{Enter}");

  expect(local.getAttribute("aria-pressed")).toBe("true");
  expect(JSON.parse(localStorage.getItem("preferences")!).zone).toBe("local");
});
