import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./tokens.css";
import "./index.css";
import { Layout } from "./components/Layout/Layout.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { NotFound } from "./pages/NotFound/NotFound.tsx";
import { SectionPage } from "./pages/SectionPage/SectionPage.tsx";
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
