import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { UpgradeSection } from "./UpgradeSection.tsx";

test("puts the warning beside the advice, before tables and links", () => {
  renderWithProviders(
    <UpgradeSection
      section={{
        id: "demo",
        title: "Demo",
        items: ["Advice"],
        warning: "Loss",
        links: [{ to: "/growth", label: "Materials" }],
      }}
    >
      <table aria-label="Demo table">
        <tbody>
          <tr>
            <th scope="row">Row</th>
          </tr>
        </tbody>
      </table>
    </UpgradeSection>,
  );

  const region = within(screen.getByRole("region", { name: "Demo" }));
  const order = [
    region.getByText("Advice"),
    region.getByRole("note"),
    region.getByRole("table"),
    region.getByRole("link", { name: /Materials/ }),
  ];

  for (let i = 1; i < order.length; i++)
    expect(
      order[i - 1].compareDocumentPosition(order[i]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
});

test("leaves out an absent warning", () => {
  renderWithProviders(
    <UpgradeSection section={{ id: "plain", title: "Plain", items: ["A"] }} />,
  );

  expect(screen.queryByRole("note")).toBeNull();
});
