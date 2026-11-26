import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LayoutService } from './layout.service';
import { NAV_GROUPS, NavGroup, itemsVisibles } from './nav.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.css',
})
export class AppSidebarComponent {
  readonly layout = inject(LayoutService);
  readonly auth = inject(AuthService);
  readonly groupes: NavGroup[] = NAV_GROUPS;

  private readonly router = inject(Router);
  private readonly deplies = new Set<string>();

  constructor() {
    const initial = this.trouverGroupe(this.router.url);
    if (initial) this.deplies.add(initial);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const courant = this.trouverGroupe(this.router.url);
        if (courant) this.deplies.add(courant);
        this.layout.fermer();
      });
  }

  itemsVisibles(groupe: NavGroup) {
    return itemsVisibles(groupe, this.auth.getRole());
  }

  estDeplie(label: string): boolean {
    return this.deplies.has(label);
  }

  basculer(label: string): void {
    if (this.deplies.has(label)) this.deplies.delete(label);
    else this.deplies.add(label);
  }

  private trouverGroupe(url: string): string | null {
    let meilleur: { label: string; longueur: number } | null = null;

    for (const groupe of NAV_GROUPS) {
      for (const item of groupe.items) {
        const correspond = url === item.path || url.startsWith(`${item.path}/`);
        if (correspond && item.path.length > (meilleur?.longueur ?? 0)) {
          meilleur = { label: groupe.label, longueur: item.path.length };
        }
      }
    }

    return meilleur?.label ?? null;
  }
}
