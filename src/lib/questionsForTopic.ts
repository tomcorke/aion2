import { openQuestions } from "../data/openQuestions.ts";

/** Open questions whose advice links into a top-level section, such as "festival". */
export function questionsForTopic(topic: string) {
  return openQuestions.filter(({ relatedGuideLinks }) =>
    relatedGuideLinks.some(({ to }) => to.split("/")[1] === topic),
  );
}
