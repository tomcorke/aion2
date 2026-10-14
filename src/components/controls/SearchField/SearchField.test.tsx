import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SearchField } from "./SearchField.tsx";

function Search() {
  const [value, setValue] = useState("");

  return (
    <SearchField label="Search materials" value={value} onChange={setValue} />
  );
}

test("a labelled search field accepts and clears its controlled value", async () => {
  renderWithProviders(<Search />);

  const input = screen.getByRole("searchbox", { name: "Search materials" });

  await userEvent.type(input, "cube");

  expect((input as HTMLInputElement).value).toBe("cube");

  await userEvent.clear(input);

  expect((input as HTMLInputElement).value).toBe("");
});
