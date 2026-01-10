/**
 * @Project       NgSSR Todo App
 * @BD_ID         UTIL-001
 * @Description   Utility functions for sanitizing and validating data
 * @Author        developer
 * @CreatedDate   2026-01-10
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

/**
 * Validation constants for Todo entity
 */
export const TODO_VALIDATION = {
  /** Minimum length for todo title */
  TITLE_MIN_LENGTH: 1,
  /** Maximum length for todo title (prevents excessively long inputs) */
  TITLE_MAX_LENGTH: 200,
  /** Maximum length for todo ID */
  ID_MAX_LENGTH: 50,
  /** Valid ID pattern: alphanumeric, underscore, hyphen only */
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
} as const;

/**
 * Sanitize string input by trimming and removing dangerous characters.
 * Angular already escapes HTML in templates, but this adds extra protection.
 *
 * @param input - Raw string input
 * @returns Sanitized string
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) {
    return "";
  }
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, TODO_VALIDATION.TITLE_MAX_LENGTH);
}

/**
 * Validate if a string is a valid ID format.
 * IDs should only contain alphanumeric characters, underscores, and hyphens.
 *
 * @param id - ID string to validate
 * @returns true if valid, false otherwise
 */
export function isValidId(id: string | null | undefined): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }
  return (
    TODO_VALIDATION.ID_PATTERN.test(id) &&
    id.length > 0 &&
    id.length <= TODO_VALIDATION.ID_MAX_LENGTH
  );
}

/**
 * Validate if a title is valid.
 *
 * @param title - Title string to validate
 * @returns true if valid, false otherwise
 */
export function isValidTitle(title: string | null | undefined): boolean {
  if (!title || typeof title !== "string") {
    return false;
  }
  const trimmed = title.trim();
  return (
    trimmed.length >= TODO_VALIDATION.TITLE_MIN_LENGTH &&
    trimmed.length <= TODO_VALIDATION.TITLE_MAX_LENGTH
  );
}

/**
 * Type guard to check if value is a valid Todo object.
 *
 * @param value - Value to check
 * @returns true if value is a valid Todo
 */
export function isTodo(value: unknown): value is {
  id: string;
  title: string;
  completed: boolean;
} {
  if (!value || typeof value !== "object") {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj["id"] === "string" &&
    typeof obj["title"] === "string" &&
    typeof obj["completed"] === "boolean" &&
    isValidId(obj["id"] as string)
  );
}

/**
 * Type guard to check if value is a valid Todo array.
 *
 * @param value - Value to check
 * @returns true if value is a valid Todo array
 */
export function isTodoArray(value: unknown): value is Array<{
  id: string;
  title: string;
  completed: boolean;
}> {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(isTodo);
}
