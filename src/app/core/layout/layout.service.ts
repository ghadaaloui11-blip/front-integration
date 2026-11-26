import { Injectable, signal } from '@angular/core';

/** État purement visuel du tiroir de navigation (aucune donnée métier). */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly menuOuvert = signal(false);

  ouvrir(): void {
    this.menuOuvert.set(true);
    this.synchroniserScroll();
  }

  fermer(): void {
    this.menuOuvert.set(false);
    this.synchroniserScroll();
  }

  basculer(): void {
    this.menuOuvert.update((ouvert) => !ouvert);
    this.synchroniserScroll();
  }

  private synchroniserScroll(): void {
    document.body.classList.toggle('menu-ouvert', this.menuOuvert());
  }
}
