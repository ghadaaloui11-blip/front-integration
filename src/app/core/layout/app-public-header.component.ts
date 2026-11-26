import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PUBLIC_LINKS } from './nav.config';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-public-header.component.html',
  styleUrl: './app-public-header.component.css',
})
export class AppPublicHeaderComponent {
  readonly liens = PUBLIC_LINKS;
  readonly auth = inject(AuthService);
  readonly menuOuvert = signal(false);

  private readonly router = inject(Router);

  connecte(): boolean {
    return this.auth.estConnecte();
  }

  fermer(): void {
    this.menuOuvert.set(false);
  }

  basculer(): void {
    this.menuOuvert.update((ouvert) => !ouvert);
  }

  deconnecter(): void {
    this.fermer();
    this.auth.deconnecter();
    this.router.navigate(['/accueil']);
  }
}
