import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderLabel',
})
export class GenderLabelPipe implements PipeTransform {
  transform(value: 'male' | 'female' | 'other'): string {
    switch (value) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Femenino';
      case 'other':
        return 'Otro';
      default:
        return '';
    }
  }
}
