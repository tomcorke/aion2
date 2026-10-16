import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { openQuestionGroups, openQuestions } from "../../data/openQuestions.ts";
import { sourceDetails } from "../../data/sourceDetails.ts";
import {
  imageCredits,
  sourceList,
  sources,
  type SourceId,
} from "../../data/sources.ts";
import { formatDate } from "../../lib/time.ts";
import { questionsForTopic } from "../../lib/questionsForTopic.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Sources } from "./Sources.tsx";

test("lists every source, linked where it has a link", () => {
  renderWithProviders(<Sources />);

  const guides = within(
    screen.getByRole("region", { name: "Guides and data" }),
  );

  for (const { name, url } of sourceList) {
    if (url)
      expect(guides.getByRole("link", { name }).getAttribute("href")).toBe(url);
    else expect(guides.getByText(name)).toBeDefined();
  }
});

test("credits the images", () => {
  renderWithProviders(<Sources />);

  const images = within(screen.getByRole("region", { name: "Images" }));

  for (const { name, url } of imageCredits)
    expect(images.getByRole("link", { name }).getAttribute("href")).toBe(url);
});

test("groups open questions by topic, in curated order", () => {
  renderWithProviders(<Sources />);

  const questions = screen.getByRole("region", { name: "Open questions" });

  for (const { id, title } of openQuestionGroups) {
    const group = within(questions).getByRole("region", { name: title });
    const expected = openQuestions.filter((q) => q.groupId === id);

    expect(within(group).getAllByRole("listitem")).toHaveLength(
      expected.length,
    );

    for (const { unknown } of expected)
      expect(within(group).getByText(unknown)).toBeDefined();
  }
});

test("every question says why it matters, what to check and where it applies", () => {
  renderWithProviders(<Sources />);

  for (const question of openQuestions) {
    const item = screen.getByRole("listitem", { name: question.unknown });

    expect(within(item).getByText(question.why)).toBeDefined();
    expect(within(item).getByText(question.practicalCheck)).toBeDefined();

    for (const { to, label } of question.relatedGuideLinks)
      expect(
        within(item)
          .getByRole("link", { name: `${label} →` })
          .getAttribute("href"),
      ).toBe(to);
  }
});

test("questions link only public supporting sources", () => {
  renderWithProviders(<Sources />);

  const questions = screen.getByRole("region", { name: "Open questions" });
  const external = within(questions)
    .getAllByRole("link")
    .map((link) => link.getAttribute("href")!)
    .filter((href) => !href.startsWith("/"));

  for (const href of external) expect(href).toMatch(/^https:\/\//);

  expect(external.some((href) => href.includes("claude.ai"))).toBe(false);
});

test("resolved questions and private checks stay out", () => {
  renderWithProviders(<Sources />);

  const questions = screen.getByRole("region", { name: "Open questions" });

  expect(within(questions).queryByText(/wing.*shar.*unresolved/i)).toBeNull();
  expect(within(questions).queryByText(/artifact|snapshot/i)).toBeNull();
  expect(within(questions).queryByText(/\[|verified by|evidence/i)).toBeNull();
});

test("states that reviewed dates are not new source checks", () => {
  renderWithProviders(<Sources />);

  expect(screen.getByText(/not a\s+new check of these sources/)).toBeDefined();
});

test("shows recorded check dates and access notes, and invents none", () => {
  renderWithProviders(<Sources />);

  const guides = screen.getByRole("region", { name: "Guides and data" });

  for (const id of Object.keys(sources) as SourceId[]) {
    const { name } = sources[id];
    const item = within(guides)
      .getAllByRole("listitem")
      .find((li) => li.firstChild!.textContent === name)!;
    const time = item.querySelector("time");
    const details = sourceDetails[id];

    expect(time?.getAttribute("dateTime")).toBe(details?.checkedDate);

    if (details?.checkedDate)
      expect(time!.textContent).toBe(formatDate(details.checkedDate));

    if (details?.accessNote)
      expect(item.textContent).toContain(details.accessNote);
  }
});

test("open questions come before the source catalog", () => {
  renderWithProviders(<Sources />);

  const [first] = screen.getAllByRole("heading", { level: 2 });

  expect(first!.textContent).toBe("Open questions");
});

test("shows the three Daevanion gaps in their own filtered group", () => {
  renderWithProviders(<Sources />, { path: "/sources?topic=daevanion" });

  const group = within(
    screen.getByRole("region", { name: "Daevanion builds and resets" }),
  );

  expect(group.getAllByRole("listitem")).toHaveLength(3);
  expect(group.getByText(/Daevanion skill priorities/)).toBeDefined();
  expect(group.getByText(/Whether Azphel's Status Effect/)).toBeDefined();
  expect(
    group.getByText(/Whether a whole-board Daevanion reset/),
  ).toBeDefined();
  expect(screen.getByText(/affect the Daevanion section/)).toBeDefined();
  expect(
    screen.queryByRole("region", { name: "EU clocks and event schedules" }),
  ).toBeNull();
});

test("an unknown topic keeps all 27 questions visible", () => {
  renderWithProviders(<Sources />, { path: "/sources?topic=unknown" });

  const questions = within(
    screen.getByRole("region", { name: "Open questions" }),
  );

  expect(questions.getAllByRole("listitem")).toHaveLength(27);
  expect(questions.queryByText(/Showing questions that affect/)).toBeNull();
});

test("filters questions to one section and offers the full list", () => {
  renderWithProviders(<Sources />, { path: "/sources?topic=festival" });

  const questions = screen.getByRole("region", { name: "Open questions" });
  const expected = questionsForTopic("festival");

  expect(
    within(questions).getAllByRole("listitem", { name: /./ }),
  ).toHaveLength(expected.length);
  expect(
    within(questions).getByText(/affect the Shugo Festival section/),
  ).toBeDefined();
  expect(
    within(questions)
      .getByRole("link", { name: "Show all questions" })
      .getAttribute("href"),
  ).toBe("/sources");
  expect(screen.getByRole("region", { name: "Guides and data" })).toBeDefined();
});
