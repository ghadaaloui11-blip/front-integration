import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { LayoutService } from './core/layout/layout.service';
import { AppSidebarComponent } from './core/layout/app-sidebar.component';
import { AppTopbarComponent } from './core/layout/app-topbar.component';
import { AppPublicHeaderComponent } from './core/layout/app-public-header.component';
import { AppPublicFooterComponent } from './core/layout/app-public-footer.component';
import { libellePourUrl } from './core/layout/nav.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AppSidebarComponent,
    AppTopbarComponent,
    AppPublicHeaderComponent,
    AppPublicFooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly layout = inject(LayoutService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.layout.fermer();
        document.title = `${this.titreCourant()} — MennaFina`;
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login') || url.startsWith('/inscription');
  }

  isAccueilPage(): boolean {
    return this.router.url === '/accueil' || this.router.url === '/';
  }

  estConnecte(): boolean {
    return this.auth.estConnecte();
  }

  private titreCourant(): string {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return (route.data['titre'] as string | undefined) ?? libellePourUrl(this.router.url);
  }

  @HostListener('document:keydown.escape')
  surEchap(): void {
    if (this.layout.menuOuvert()) this.layout.fermer();
  }
}
