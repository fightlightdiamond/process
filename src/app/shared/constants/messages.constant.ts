/**
 * @Project       NgSSR Todo App
 * @BD_ID         CONST-001
 * @Description   Application message constants for consistency and i18n readiness
 * @Author        developer
 * @CreatedDate   2026-01-10
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

/**
 * Error messages for Todo operations
 */
export const TODO_ERROR_MESSAGES = {
  // API errors
  LOAD_FAILED: "Failed to load todos",
  ADD_FAILED: "Failed to add todo",
  UPDATE_FAILED: "Failed to update todo",
  DELETE_FAILED: "Failed to delete todo",

  // Validation errors
  INVALID_ID: "Invalid todo ID format",
  INVALID_TITLE: "Invalid todo title",
  INVALID_DATA: "Invalid data received from server",
  INVALID_DATA_SHORT: "Invalid data received",
} as const;

/**
 * Form validation error messages
 */
export const FORM_ERROR_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  TITLE_WHITESPACE: "Title cannot be only whitespace",
  TITLE_MAX_LENGTH: (maxLength: number) =>
    `Title cannot exceed ${maxLength} characters`,
} as const;

/**
 * UI labels and text
 */
export const UI_LABELS = {
  ADD_TODO: "Add",
  UPDATE_TODO: "Update",
  CANCEL: "Cancel",
  DELETE: "Delete",
  EDIT: "Edit",
} as const;
