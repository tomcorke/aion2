import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { AzphelRoute } from "./AzphelRoute.tsx";

test("Azphel shows its own pool and two cumulative phases, not PvE variants", () => {
  renderWithProviders(<AzphelRoute />);

  expect(screen.getByText(/never spends points/)).toBeDefined();
  expect(screen.getByText(/three PvE variants do not apply/)).toBeDefined();
  expect(screen.queryByText("Damage + utility")).toBeNull();

  const [first, second] = within(screen.getAllByRole("list")[0]).getAllByRole(
    "listitem",
  );

  expect(first.textContent).toMatch(
    /HP and MP first.*36 points · 36 in total.*\+400 HP, \+200 MP/,
  );
  expect(second.textContent).toMatch(
    /Status Effect continuation.*78 points · 114 in total/,
  );
  expect(
    (
      screen.getByRole("meter", {
        name: "Status Effect continuation: 114 of 232 points in total",
      }) as HTMLMeterElement
    ).value,
  ).toBe(114);
  expect(
    screen.getByText(/value against PvE monsters and bosses is not confirmed/),
  ).toBeDefined();
  expect(screen.getByText(/110 points, not proven minimal/)).toBeDefined();
});
