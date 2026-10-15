import { StrictMode, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import "./styles/tokens.css";
import "./styles/global.css";
import { Layout } from "./components/shell/Layout/Layout.tsx";
import { PreferencesProvider } from "./preferences/PreferencesProvider.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { Alts } from "./pages/Alts/Alts.tsx";
import { Daevanion } from "./pages/Daevanion/Daevanion.tsx";
import { Enhancement } from "./pages/Enhancement/Enhancement.tsx";
import { Festival } from "./pages/Festival/Festival.tsx";
import { Gear } from "./pages/Gear/Gear.tsx";
import { Growth } from "./pages/Growth/Growth.tsx";
import { NotFound } from "./pages/NotFound/NotFound.tsx";
import { Progression } from "./pages/Progression/Progression.tsx";
import { Routine } from "./pages/Routine/Routine.tsx";

import { Skins } from "./pages/Skins/Skins.tsx";
import { Sources } from "./pages/Sources/Sources.tsx";
import { Timers } from "./pages/Timers/Timers.tsx";
import { sections, type SectionPath } from "./data/sections.ts";

// Every section must have a real page; a missing registration fails typecheck.
const builtPages: Record<SectionPath, ReactElement> = {
  alts: <Alts />,
  daevanion: <Daevanion />,
  festival: <Festival />,
  gear: <Gear />,
  growth: <Growth />,
  progression: <Progression />,
  routine: <Routine />,
  skins: <Skins />,
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
        element: builtPages[section.path],
      })),
      { path: "daevanion/:class", element: <Daevanion /> },
      { path: "daevanion/:class/:board/:variant?", element: <Daevanion /> },
      { path: "festival/simulator", element: <Festival /> },
      { path: "gear/enhancement", element: <Enhancement /> },
      { path: "gear/:tier", element: <Gear /> },
      { path: "skins/:set", element: <Skins /> },
      { path: "timers/:view", element: <Timers /> },
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
