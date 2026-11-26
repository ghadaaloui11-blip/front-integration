import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationCenterComponent } from '../components/notification-center/notification-center.component';
import { AuthService } from '../services/auth.service';
import { LayoutService } from './layout.service';
import { libellePourUrl } from './nav.config';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule, RouterLink, NotificationCenterComponent],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.css',
})
export class AppTopbarComponent {
  readonly layout = inject(LayoutService);
  readonly auth = inject(AuthService);

  private readonly router = inject(Router);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  terme = '';
  readonly menuOuvert = signal(false);

  titre(): string {
    return libellePourUrl(this.router.url);
  }

  prenom(): string {
    return this.auth.getPrenom() ?? this.auth.getNom()?.split(' ')[0] ?? 'Mon espace';
  }

  initiales(): string {
    const nom = this.auth.getNom() ?? this.prenom();
    return nom
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  rechercher(): void {
    this.menuOuvert.set(false);
    this.router.navigate(['/recherche'], {
      queryParams: { q: this.terme.trim() || null },
    });
  }

  basculerMenu(): void {
    this.menuOuvert.update((ouvert) => !ouvert);
  }

  deconnecter(): void {
    this.menuOuvert.set(false);
    this.layout.fermer();
    this.auth.deconnecter();
    this.router.navigate(['/accueil']);
  }

  @HostListener('document:click', ['$event.target'])
  surClicExterne(cible: EventTarget | null): void {
    if (!(cible instanceof Node) || !this.host.nativeElement.contains(cible)) {
      this.menuOuvert.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  surEchap(): void {
    this.menuOuvert.set(false);
  }
}
