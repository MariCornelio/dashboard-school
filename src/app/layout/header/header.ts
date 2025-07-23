import { Component, EventEmitter, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { Card } from 'primeng/card';
import { LayoutService } from '../services/layout-service';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, Breadcrumb, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;
  constructor(private layoutSvc: LayoutService) {}

  ngOnInit() {
    this.home = { icon: 'pi pi-home', routerLink: '/admin' };
    this.layoutSvc.menuBreadcrumbAction$
      .pipe(tap((items) => (this.items = items)))
      .subscribe();
  }
  //TODO:desuscripcion
  onMenuToggle() {
    this.layoutSvc.onMenuToggle();
  }
}
