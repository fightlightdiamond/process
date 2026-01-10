import { FormControl } from "@angular/forms";
import * as fc from "fast-check";
import { noWhitespaceValidator } from "./no-whitespace.validator";

describe("noWhitespaceValidator", () => {
  describe("Unit Tests", () => {
    it("should return null for valid string", () => {
      // Arrange
      const control = new FormControl("valid");
      // Act
      const result = noWhitespaceValidator(control);
      // Assert
      expect(result).toBeNull();
    });

    it("should return error for whitespace-only string", () => {
      // Arrange
      const control = new FormControl("   ");
      // Act
      const result = noWhitespaceValidator(control);
      // Assert
      expect(result).toEqual({ whitespace: true });
    });

    it("should return null for empty string (handled by required)", () => {
      // Arrange
      const control = new FormControl("");
      // Act
      const result = noWhitespaceValidator(control);
      // Assert
      expect(result).toBeNull();
    });

    it("should return null for null value", () => {
      // Arrange
      const control = new FormControl(null);
      // Act
      const result = noWhitespaceValidator(control);
      // Assert
      expect(result).toBeNull();
    });

    it("should return null for string with leading/trailing whitespace but content", () => {
      // Arrange
      const control = new FormControl("  valid  ");
      // Act
      const result = noWhitespaceValidator(control);
      // Assert
      expect(result).toBeNull();
    });
  });

  describe("Property Tests", () => {
    // Arbitrary for generating whitespace-only strings
    const whitespaceOnlyArbitrary = fc
      .array(fc.constantFrom(" ", "\t", "\n", "\r"), {
        minLength: 1,
        maxLength: 10,
      })
      .map((chars: string[]) => chars.join(""));

    // Arbitrary for generating valid non-whitespace strings
    const validStringArbitrary = fc
      .string({ minLength: 1 })
      .filter((s) => s.trim().length > 0);

    it("should return error for any whitespace-only string", () => {
      fc.assert(
        fc.property(whitespaceOnlyArbitrary, (whitespace: string) => {
          // Arrange
          const control = new FormControl(whitespace);
          // Act
          const result = noWhitespaceValidator(control);
          // Assert
          expect(result).toEqual({ whitespace: true });
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("should return null for any string with non-whitespace content", () => {
      fc.assert(
        fc.property(validStringArbitrary, (validString: string) => {
          // Arrange
          const control = new FormControl(validString);
          // Act
          const result = noWhitespaceValidator(control);
          // Assert
          expect(result).toBeNull();
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
