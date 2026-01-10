/**
 * @Project       NgSSR Todo App
 * @BD_ID         VAL-002
 * @Description   Unit tests for max-length validator
 * @Author        developer
 * @CreatedDate   2026-01-10
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

import { FormControl } from "@angular/forms";
import { maxLengthTrimmedValidator } from "./max-length.validator";

describe("maxLengthTrimmedValidator", () => {
  const validator = maxLengthTrimmedValidator(10);

  it("should return null for empty value", () => {
    // Arrange
    const control = new FormControl("");
    // Act
    const result = validator(control);
    // Assert
    expect(result).toBeNull();
  });

  it("should return null for null value", () => {
    // Arrange
    const control = new FormControl(null);
    // Act
    const result = validator(control);
    // Assert
    expect(result).toBeNull();
  });

  it("should return null for value within limit", () => {
    // Arrange
    const control = new FormControl("12345");
    // Act
    const result = validator(control);
    // Assert
    expect(result).toBeNull();
  });

  it("should return null for value at exact limit", () => {
    // Arrange
    const control = new FormControl("1234567890");
    // Act
    const result = validator(control);
    // Assert
    expect(result).toBeNull();
  });

  it("should return error for value exceeding limit", () => {
    // Arrange
    const control = new FormControl("12345678901");
    // Act
    const result = validator(control);
    // Assert
    expect(result).toEqual({
      maxLengthTrimmed: {
        requiredLength: 10,
        actualLength: 11,
      },
    });
  });

  it("should trim value before checking length", () => {
    // Arrange - value with spaces that trims to 5 chars
    const control = new FormControl("  12345  ");
    // Act
    const result = validator(control);
    // Assert
    expect(result).toBeNull();
  });

  it("should return error for trimmed value exceeding limit", () => {
    // Arrange - value with spaces that trims to 11 chars
    const control = new FormControl("  12345678901  ");
    // Act
    const result = validator(control);
    // Assert
    expect(result).toEqual({
      maxLengthTrimmed: {
        requiredLength: 10,
        actualLength: 11,
      },
    });
  });
});
