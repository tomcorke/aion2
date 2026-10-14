import { StrictMode, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import "./styles/tokens.css";
import "./styles/global.css";
import { Layout } from "./components/shell/Layout/Layout.tsx";
import { PreferencesProvider } from "./preferences/PreferencesProvider.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { Festival } from "./pages/Festival/Festival.tsx";
import { NotFound } from "./pages/NotFound/NotFound.tsx";
import { Progression } from "./pages/Progression/Progression.tsx";
import { SectionPage } from "./pages/SectionPage/SectionPage.tsx";
import { Sources } from "./pages/Sources/Sources.tsx";
import { Timers } from "./pages/Timers/Timers.tsx";
import { sections } from "./data/sections.ts";

// Sections with a built page; the rest show a stand-in.
const builtPages: Record<string, ReactElement> = {
  festival: <Festival />,
  progression: <Progression />,
  timers: <Timers />,
  sources: <Sources />,
};

// Hash URLs (/#/timers): GitHub Pages has no SPA rewrites, so path URLs would 404.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ...sections.map((section) => ({
        path: section.path,
        element: builtPages[section.path] ?? <SectionPage section={section} />,
      })),
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>
  </StrictMode>,
);
