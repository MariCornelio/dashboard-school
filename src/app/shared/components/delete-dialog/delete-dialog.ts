import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-delete-dialog',
  imports: [ConfirmDialog, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.css',
})
export class DeleteDialog {
  @Input() header!: string;
  @Input() message!: string;
  @Input() loading!: boolean;

  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();
  constructor(private confirmationSvc: ConfirmationService) {}
  show() {
    this.confirmationSvc.confirm({
      header: this.header,
      message: this.message,
      accept: () => this.onAccept.emit(),
      reject: () => this.onReject.emit(),
    });
  }
}
