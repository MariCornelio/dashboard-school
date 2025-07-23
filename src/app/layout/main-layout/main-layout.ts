import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { LayoutService } from '../services/layout-service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  constructor(private layoutSvc: LayoutService) {}

  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    const isInsideSidebar = clickedElement.closest('app-sidebar');
    const isExcludedButton = clickedElement.closest('.ignore-click');

    if (!isInsideSidebar && !isExcludedButton) {
      console.log('click layout');
      this.layoutSvc.onClickLayoutForMobile();
    }
  }
}
