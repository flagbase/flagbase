module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:tailwindcss/recommended",
  ],
  plugins: ["prettier", "react", "react-hooks", "storybook"],
  settings: {
    react: {
      version: "detect",
    },
    "import-resolver": {
      typescript: true,
      node: true,
    },
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  rules: {
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" },
    ],
    curly: ["error", "all"],
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          ["parent", "sibling", "index"],
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "@typescript-eslint/no-empty-function": "off",
    "react/no-unescaped-entities": "off",
  },
};
