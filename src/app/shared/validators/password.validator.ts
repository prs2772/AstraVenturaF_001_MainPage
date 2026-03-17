import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validates a password against strong security rules:
 * - At least 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one symbol indexable: !#$&/()=.
 */
export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) return null; // minLength or required should handle empty cases if needed

  const errors: string[] = [];

  if (value.length < 8) {
    errors.push('Min. 8 characters');
  }
  if (!/[A-Z]/.test(value)) {
    errors.push('One uppercase');
  }
  if (!/[a-z]/.test(value)) {
    errors.push('One lowercase');
  }
  if (!/[0-9]/.test(value)) {
    errors.push('One number');
  }
  if (!/[!#$&/()=.]/.test(value)) {
    errors.push('One symbol: !#$&/()=.?¿¡');
  }

  return errors.length > 0 ? { strongPassword: errors } : null;
}
