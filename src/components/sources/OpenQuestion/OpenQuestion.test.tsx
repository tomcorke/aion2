import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { OpenQuestion as Question } from "../../../data/openQuestions.ts";
import { sources } from "../../../data/sources.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { OpenQuestion } from "./OpenQuestion.tsx";

const question: Question = {
  id: "demo",
  groupId: "timers",
  unknown: "Unknown thing.",
  why: "Why.",
  practicalCheck: "Check.",
  relatedGuideLinks: [{ to: "/timers", label: "Timers" }],
  supportingSourceIDs: ["metabotEvents", "ownChecks"],
};

const renderQuestion = (q: Question) =>
  renderWithProviders(
    <ul>
      <OpenQuestion question={q} />
    </ul>,
  );

test("links router pages and only sources with public URLs", () => {
  renderQuestion(question);

  expect(
    screen.getByRole("link", { name: "Timers →" }).getAttribute("href"),
  ).toBe("/timers");
  expect(
    screen
      .getByRole("link", { name: sources.metabotEvents.name })
      .getAttribute("href"),
  ).toBe(sources.metabotEvents.url);
  expect(screen.queryByText(sources.ownChecks.name)).toBeNull();
});

test("omits the sources line when nothing public supports it", () => {
  renderQuestion({ ...question, supportingSourceIDs: [] });

  expect(screen.queryByText(/Sources:/)).toBeNull();
  expect(
    screen.getByRole("listitem", { name: "Unknown thing." }),
  ).toBeDefined();
});
