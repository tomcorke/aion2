import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { Layout } from "./Layout.tsx";
import { Home, NotFound, SectionPage } from "./pages.tsx";
import { sections } from "./sections.ts";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...sections.map((section) => ({
        path: section.path,
        element: <SectionPage section={section} />,
      })),
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
