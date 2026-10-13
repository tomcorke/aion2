import { StrictMode, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./tokens.css";
import "./index.css";
import { Layout } from "./components/Layout/Layout.tsx";
import { PreferencesProvider } from "./components/PreferencesProvider/PreferencesProvider.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { NotFound } from "./pages/NotFound/NotFound.tsx";
import { SectionPage } from "./pages/SectionPage/SectionPage.tsx";
import { Sources } from "./pages/Sources/Sources.tsx";
import { Timers } from "./pages/Timers/Timers.tsx";
import { sections } from "./sections.ts";

// Sections with a built page; the rest show a stand-in.
const builtPages: Record<string, ReactElement> = {
  timers: <Timers />,
  sources: <Sources />,
};

const router = createBrowserRouter([
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
