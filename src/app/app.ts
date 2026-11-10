import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  private router = inject(Router);
  auth = inject(AuthService);

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login') || url.startsWith('/inscription');
  }

  isAccueilPage(): boolean {
    return this.router.url === '/accueil' || this.router.url === '/';
  }

  /** Visiteur non connecté : pas de sidebar, layout pleine page avec navbar accueil */
  isVisiteur(): boolean {
    return !this.auth.getToken();
  }

  logout() {
    this.auth.deconnecter();
    this.router.navigate(['/accueil']);
  }
}