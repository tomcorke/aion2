import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { expect, test } from "vitest";
import { PreferencesProvider } from "../../../preferences/PreferencesProvider.tsx";
import { Layout } from "./Layout.tsx";

test("puts the header above the routed page", () => {
  const router = createMemoryRouter([
    {
      element: <Layout />,
      children: [{ path: "/", element: <p>Page body</p> }],
    },
  ]);

  render(
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>,
  );

  expect(screen.getByRole("banner")).toBeDefined();
  expect(screen.getByRole("main").textContent).toBe("Page body");
});
