import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../services/layout-service';
import { Subject, takeUntil, tap } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [Menu, AvatarModule, CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  items: MenuItem[] | undefined;
  sidebarVisible!: boolean;
  overlayMenuActive!: boolean;

  private destroy$ = new Subject<void>();

  constructor(private layoutSvc: LayoutService) {}
  ngOnInit(): void {
    this.items = [
      {
        separator: true,
      },
      { label: 'Inicio', icon: 'pi pi-home', routerLink: '/admin' },
      {
        label: 'Profesores',
        icon: 'pi pi-briefcase',
        routerLink: '/admin/profesores',
      },
      { label: 'Cursos', icon: 'pi pi-book' },
      { label: 'Alumnos', icon: 'pi pi-user' },
    ];

    this.layoutSvc.sidebarVisibleAction$
      .pipe(
        takeUntil(this.destroy$),
        tap((data: boolean) => (this.sidebarVisible = data))
      )
      .subscribe();

    this.layoutSvc.overlayMenuActiveAction$
      .pipe(
        takeUntil(this.destroy$),
        tap((data: boolean) => (this.overlayMenuActive = data))
      )
      .subscribe();
  }
  get classSideBar() {
    const base: string = 'transition-all duration-300 z-10';

    const overlay: string = this.overlayMenuActive
      ? 'translate-x-0 h-full top-0 left-0 fixed'
      : 'h-full top-0 left-0 fixed -translate-x-[120%]';

    const sidebar: string = this.sidebarVisible
      ? 'lg:h-[calc(100vh-2rem)] lg:sticky lg:top-4 lg:-translate-x-0'
      : 'lg:h-[calc(100vh-2rem)] lg:absolute lg:-translate-x-[110%]';
    return `${base} ${overlay} ${sidebar}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
