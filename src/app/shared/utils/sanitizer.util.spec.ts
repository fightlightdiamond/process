/**
 * @Project       NgSSR Todo App
 * @BD_ID         UTIL-001
 * @Description   Unit tests for sanitizer utilities
 * @Author        developer
 * @CreatedDate   2026-01-10
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

import * as fc from "fast-check";
import {
  sanitizeString,
  isValidId,
  isValidTitle,
  isTodo,
  isTodoArray,
  TODO_VALIDATION,
} from "./sanitizer.util";

describe("Sanitizer Utilities", () => {
  describe("sanitizeString", () => {
    it("should return empty string for null", () => {
      // Arrange & Act
      const result = sanitizeString(null);
      // Assert
      expect(result).toBe("");
    });

    it("should return empty string for undefined", () => {
      // Arrange & Act
      const result = sanitizeString(undefined);
      // Assert
      expect(result).toBe("");
    });

    it("should trim whitespace", () => {
      // Arrange & Act
      const result = sanitizeString("  hello  ");
      // Assert
      expect(result).toBe("hello");
    });

    it("should remove < and > characters", () => {
      // Arrange & Act
      const result = sanitizeString('<script>alert("xss")</script>');
      // Assert
      expect(result).toBe('scriptalert("xss")/script');
    });

    it("should truncate to max length", () => {
      // Arrange
      const longString = "a".repeat(300);
      // Act
      const result = sanitizeString(longString);
      // Assert
      expect(result.length).toBe(TODO_VALIDATION.TITLE_MAX_LENGTH);
    });

    // Property test: sanitized string never contains < or >
    it("Property: sanitized string never contains HTML brackets", () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = sanitizeString(input);
          return !result.includes("<") && !result.includes(">");
        }),
        { numRuns: 100 }
      );
    });

    // Property test: sanitized string length never exceeds max
    it("Property: sanitized string length never exceeds max", () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = sanitizeString(input);
          return result.length <= TODO_VALIDATION.TITLE_MAX_LENGTH;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("isValidId", () => {
    it("should return false for null", () => {
      expect(isValidId(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isValidId(undefined)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidId("")).toBe(false);
    });

    it("should return true for alphanumeric id", () => {
      expect(isValidId("abc123")).toBe(true);
    });

    it("should return true for id with underscore", () => {
      expect(isValidId("todo_1")).toBe(true);
    });

    it("should return true for id with hyphen", () => {
      expect(isValidId("todo-1")).toBe(true);
    });

    it("should return false for id with special characters", () => {
      expect(isValidId("todo@1")).toBe(false);
      expect(isValidId("todo/1")).toBe(false);
      expect(isValidId("todo 1")).toBe(false);
    });

    it("should return false for id exceeding 50 characters", () => {
      expect(isValidId("a".repeat(51))).toBe(false);
    });
  });

  describe("isValidTitle", () => {
    it("should return false for null", () => {
      expect(isValidTitle(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isValidTitle(undefined)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidTitle("")).toBe(false);
    });

    it("should return false for whitespace only", () => {
      expect(isValidTitle("   ")).toBe(false);
    });

    it("should return true for valid title", () => {
      expect(isValidTitle("Buy groceries")).toBe(true);
    });

    it("should return false for title exceeding max length", () => {
      expect(isValidTitle("a".repeat(201))).toBe(false);
    });

    it("should return true for title at max length", () => {
      expect(isValidTitle("a".repeat(200))).toBe(true);
    });
  });

  describe("isTodo", () => {
    it("should return false for null", () => {
      expect(isTodo(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isTodo(undefined)).toBe(false);
    });

    it("should return false for non-object", () => {
      expect(isTodo("string")).toBe(false);
      expect(isTodo(123)).toBe(false);
    });

    it("should return true for valid todo", () => {
      expect(isTodo({ id: "1", title: "Test", completed: false })).toBe(true);
    });

    it("should return false for todo with missing id", () => {
      expect(isTodo({ title: "Test", completed: false })).toBe(false);
    });

    it("should return false for todo with invalid id", () => {
      expect(
        isTodo({ id: "invalid@id", title: "Test", completed: false })
      ).toBe(false);
    });

    it("should return false for todo with wrong type", () => {
      expect(isTodo({ id: 1, title: "Test", completed: false })).toBe(false);
      expect(isTodo({ id: "1", title: 123, completed: false })).toBe(false);
      expect(isTodo({ id: "1", title: "Test", completed: "false" })).toBe(
        false
      );
    });
  });

  describe("isTodoArray", () => {
    it("should return false for non-array", () => {
      expect(isTodoArray(null)).toBe(false);
      expect(isTodoArray(undefined)).toBe(false);
      expect(isTodoArray({})).toBe(false);
    });

    it("should return true for empty array", () => {
      expect(isTodoArray([])).toBe(true);
    });

    it("should return true for valid todo array", () => {
      expect(
        isTodoArray([
          { id: "1", title: "Test 1", completed: false },
          { id: "2", title: "Test 2", completed: true },
        ])
      ).toBe(true);
    });

    it("should return false if any item is invalid", () => {
      expect(
        isTodoArray([
          { id: "1", title: "Test 1", completed: false },
          { id: "invalid@id", title: "Test 2", completed: true },
        ])
      ).toBe(false);
    });
  });
});
