import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private menuBreadcrumbSubject = new BehaviorSubject<MenuItem[] | undefined>(
    []
  );

  private sidebarVisibleSubject = new BehaviorSubject<boolean>(true);
  private overlayMenuActiveSubject = new BehaviorSubject<boolean>(false);

  get menuBreadcrumbAction$(): Observable<MenuItem[] | undefined> {
    return this.menuBreadcrumbSubject.asObservable();
  }

  get sidebarVisibleAction$(): Observable<boolean> {
    return this.sidebarVisibleSubject.asObservable();
  }
  get overlayMenuActiveAction$(): Observable<boolean> {
    return this.overlayMenuActiveSubject.asObservable();
  }

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const breadcrumbs = this.buildBreadcrumb(url);
      this.menuBreadcrumbSubject.next(breadcrumbs);
    });
  }

  private buildBreadcrumb(url: string): MenuItem[] | undefined {
    const path = url.split('?')[0];
    const parts = path.split('/').filter((p) => p);
    const labels = parts.slice(1);
    if (!labels.length) return undefined;

    return labels.map((label) => ({
      label: this.capitalize(label),
      // TODO:Puedes agregar routerLink si deseas que sean clicables
    }));
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  onMenuToggle(): void {
    if (this.isDesktop()) {
      const current = this.sidebarVisibleSubject.value;
      this.sidebarVisibleSubject.next(!current);
    } else {
      const current = this.overlayMenuActiveSubject.value;
      this.overlayMenuActiveSubject.next(!current);
    }
  }

  onClickLayoutForMobile(): void {
    this.overlayMenuActiveSubject.next(false);
  }

  isDesktop(): boolean {
    return window.innerWidth > 1023;
  }
}
