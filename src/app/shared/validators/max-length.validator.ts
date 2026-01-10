/**
 * @Project       NgSSR Todo App
 * @BD_ID         VAL-002
 * @Description   Custom form validator - enforces maximum length
 * @Author        developer
 * @CreatedDate   2026-01-10
 * @Updater       developer
 * @LastUpdated   2026-01-10
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Custom validator to enforce maximum length for trimmed value.
 * Unlike built-in maxLength, this checks the trimmed length.
 *
 * @param maxLength - Maximum allowed length
 * @returns ValidatorFn
 */
export function maxLengthTrimmedValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const trimmedLength = control.value.trim().length;
    if (trimmedLength > maxLength) {
      return {
        maxLengthTrimmed: {
          requiredLength: maxLength,
          actualLength: trimmedLength,
        },
      };
    }
    return null;
  };
}
