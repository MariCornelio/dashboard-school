import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-loader-dialog',
  imports: [DialogModule],
  templateUrl: './loader-dialog.html',
  styleUrl: './loader-dialog.css',
})
export class LoaderDialog {
  @Input() visible: boolean = false;
  @Input() message: string = '';
}
