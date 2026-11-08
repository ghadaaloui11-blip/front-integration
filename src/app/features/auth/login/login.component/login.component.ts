import { AfterViewInit, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  email = '';
  motDePasse = '';
  erreur = '';
  envoi = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngAfterViewInit() {
    this.initGoogle();
  }

  private initGoogle(tentatives = 0) {
    // el script GIS async: nستنّaw hata yتحمّل
    if (typeof google === 'undefined' || !google.accounts?.id) {
      if (tentatives < 20) {
        setTimeout(() => this.initGoogle(tentatives + 1), 250);
      }
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.onGoogleCredential(response.credential),
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      width: 300,
      text: 'continue_with',
    });
  }

  private onGoogleCredential(idToken: string) {
    this.zone.run(() => {
      this.erreur = '';
      this.authService.loginAvecGoogle(idToken).subscribe({
        next: (response) => {
          this.authService.sauvegarderToken(response.token);
          this.redirigerSelonRole();
        },
        error: (err) => {
          this.erreur =
            err.error?.erreur ?? err.error?.message ?? 'Connexion Google échouée.';
        },
      });
    });
  }

  private redirigerSelonRole() {
    const role = this.authService.getRole();
    if (role === 'association') {
      this.router.navigate(['/mes-campagnes']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/associations']);
    } else {
      this.router.navigate(['/signalement']); // citoyen
    }
  }

  onSubmit() {
    if (this.envoi) return;
    this.erreur = '';
    this.envoi = true;
    this.authService
      .connecter({ email: this.email.trim(), motDePasse: this.motDePasse.trim() })
      .subscribe({
        next: (response) => {
          this.authService.sauvegarderToken(response.token);
          this.redirigerSelonRole();
        },
        error: (err) => {
          this.erreur =
            err.error?.erreur ?? err.error?.message ?? 'Erreur lors de la connexion.';
          this.envoi = false;
        },
      });
  }
}