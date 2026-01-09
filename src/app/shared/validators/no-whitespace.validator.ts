/**
 * @Project       NgSSR Todo App
 * @BD_ID         TODO-001
 * @Description   Custom form validator - rejects whitespace-only strings
 * @Author        developer
 * @CreatedDate   2026-01-09
 * @Updater       developer
 * @LastUpdated   2026-01-09
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Custom validator to reject whitespace-only strings.
 *
 * EDGE CASE: The built-in 'required' validator passes for strings like "   "
 * because they are truthy. This validator ensures the trimmed value has content.
 *
 * @param control - The form control to validate
 * @returns ValidationErrors with 'whitespace' key if invalid, null if valid
 *
 * @example
 * ```typescript
 * new FormControl('', [Validators.required, noWhitespaceValidator])
 * ```
 */
export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  // Only validate if there's a value (let 'required' handle empty)
  if (control.value && control.value.trim().length === 0) {
    return { whitespace: true };
  }
  return null;
}
