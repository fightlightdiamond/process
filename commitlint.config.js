/**
 * Commitlint Configuration
 * Enforces Conventional Commits format
 *
 * Format: <type>(<scope>): <subject>
 *
 * Types:
 * - feat:     New feature
 * - fix:      Bug fix
 * - docs:     Documentation only changes
 * - style:    Code style changes (formatting, semicolons, etc)
 * - refactor: Code refactoring (no feature or bug fix)
 * - perf:     Performance improvements
 * - test:     Adding or updating tests
 * - build:    Build system or external dependencies
 * - ci:       CI configuration changes
 * - chore:    Other changes (maintenance tasks)
 * - revert:   Revert a previous commit
 *
 * Examples:
 * - feat(todo): add delete functionality
 * - fix(store): resolve state mutation issue
 * - docs: update README with setup instructions
 * - style: format code with prettier
 * - refactor(components): extract shared logic
 * - test(reducer): add property-based tests
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be one of the allowed values
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    // Type is required and must be lowercase
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    // Subject is required
    "subject-empty": [2, "never"],
    // Subject should not end with period
    "subject-full-stop": [2, "never", "."],
    // Subject should be lowercase
    "subject-case": [2, "always", "lower-case"],
    // Header max length (type + scope + subject)
    "header-max-length": [2, "always", 100],
    // Body max line length
    "body-max-line-length": [2, "always", 200],
  },
};
