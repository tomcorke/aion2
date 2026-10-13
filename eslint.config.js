import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    plugins: { "@stylistic": stylistic },
    rules: {
      "max-depth": ["error", 4],
      "max-lines-per-function": [
        "error",
        { IIFEs: true, max: 100, skipBlankLines: true, skipComments: true },
      ],
      "max-nested-callbacks": ["error", 3],
      "sonarjs/cognitive-complexity": ["error", 15],

      // Space code out: a blank line around blocks, after declarations and before returns.
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: ["return", "block-like", "export"],
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var", "block-like", "directive", "import"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "any", prev: "export", next: "export" },
      ],

      // Components import only their own CSS module; global CSS loads once from main.tsx.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: String.raw`(?<!\.module)\.css$`,
              message: "Import a co-located .module.css instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/main.tsx"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    // Markup-heavy JSX trips function-length limits without adding real complexity.
    files: ["src/**/*.tsx"],
    rules: { "max-lines-per-function": "off" },
  },
);
