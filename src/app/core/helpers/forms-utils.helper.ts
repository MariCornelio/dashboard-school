import { AbstractControl, FormGroup } from '@angular/forms';

// helper para mostrar mensaje de error
export function getErrorMessage(
  control: AbstractControl | null,
  fieldLabel?: string
): string | null {
  if (!control || !control.errors) return null;

  const errors = control.errors;
  if (errors['required']) return `${fieldLabel} es requerido`;
  if (errors['email']) return `Correo inválido`;
  if (errors['maxlength']) {
    const max: number = errors['maxlength'].requiredLength;
    return `${fieldLabel} excede el máximo de ${max} caracteres`;
  }
  if (errors['minlength']) {
    const min: number = errors['minlength'].requiredLength;
    return `${fieldLabel} debe tener al menos ${min} caracteres `;
  }
  if (errors['pattern']) return `${fieldLabel} tiene un formato no válido`;
  if (errors['max']) {
    const max: number = errors['max'].max;
    return `${fieldLabel} excede el máximo permitido (${max})`;
  }
  if (errors['min']) {
    const min: number = errors['min'].min;
    return `${fieldLabel} debe ser mayor que ${min}`;
  }

  return null;
}

//helper para  ver si se visualiza o no el error
export function isControlInvalid(
  form: FormGroup,
  controlName: string,
  formSubmitted: boolean
): boolean {
  const control = form.get(controlName);
  return !!control?.invalid && (control.touched || formSubmitted);
}
