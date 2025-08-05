import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { LayoutService } from '../services/layout-service';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header, Footer],
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
      this.layoutSvc.onClickLayoutForMobile();
    }
  }
}
