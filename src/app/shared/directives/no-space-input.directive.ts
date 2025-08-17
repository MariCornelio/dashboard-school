import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoSpaceInput]',
})
export class NoSpaceInputDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.trim();
    this.ngControl.control?.setValue(value);
  }
}
