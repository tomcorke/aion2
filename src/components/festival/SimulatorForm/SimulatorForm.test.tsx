import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { festivalPurchases } from "../../../data/festival.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SimulatorForm, type Draft } from "./SimulatorForm.tsx";

const draft: Draft = {
  openings: "100",
  startTokens: "0",
  target: "lightpath-trace",
  customTarget: "0",
  participation: "false",
};

test("offers every shared purchase with its total, and a custom target", () => {
  renderWithProviders(
    <SimulatorForm
      draft={draft}
      errors={{}}
      onChange={vi.fn()}
      onSubmit={vi.fn()}
    />,
  );

  const options = screen.getAllByRole("option");

  expect(options).toHaveLength(festivalPurchases.length + 1);
  expect(
    screen.getByRole("option", { name: "Spirit Wings: 4,200 tokens" }),
  ).toBeDefined();
  expect(
    screen.queryByRole("textbox", { name: "Custom target tokens" }),
  ).toBeNull();
});

test("shows the custom field only for a custom target", () => {
  renderWithProviders(
    <SimulatorForm
      draft={{ ...draft, target: "custom" }}
      errors={{}}
      onChange={vi.fn()}
      onSubmit={vi.fn()}
    />,
  );

  expect(
    screen.getByRole("textbox", { name: "Custom target tokens" }),
  ).toBeDefined();
});

test("names the field in its error and marks it invalid", () => {
  renderWithProviders(
    <SimulatorForm
      draft={{ ...draft, startTokens: "-1" }}
      errors={{
        startTokens: "startTokens must be a nonnegative safe integer.",
      }}
      onChange={vi.fn()}
      onSubmit={vi.fn()}
    />,
  );

  const field = screen.getByRole("textbox", { name: "Starting tokens" });

  expect(field.getAttribute("aria-invalid")).toBe("true");
  const described = field
    .getAttribute("aria-describedby")!
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent)
    .join(" ");

  expect(described).toContain(
    "Starting tokens must be a nonnegative safe integer.",
  );
});

test("reports edits and submits", async () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();

  renderWithProviders(
    <SimulatorForm
      draft={draft}
      errors={{}}
      onChange={onChange}
      onSubmit={onSubmit}
    />,
  );

  await userEvent.click(screen.getByRole("checkbox"));
  await userEvent.click(screen.getByRole("button", { name: "Run simulation" }));

  expect(onChange).toHaveBeenCalledWith("participation", "true");
  expect(onSubmit).toHaveBeenCalledOnce();
});
