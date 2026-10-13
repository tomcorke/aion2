import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    rules: {
      "max-depth": ["error", 4],
      "max-lines-per-function": [
        "error",
        { IIFEs: true, max: 100, skipBlankLines: true, skipComments: true },
      ],
      "max-nested-callbacks": ["error", 3],
      "sonarjs/cognitive-complexity": ["error", 15],
    },
  },
  {
    // Markup-heavy JSX trips function-length limits without adding real complexity.
    files: ["src/**/*.tsx"],
    rules: { "max-lines-per-function": "off" },
  },
);
