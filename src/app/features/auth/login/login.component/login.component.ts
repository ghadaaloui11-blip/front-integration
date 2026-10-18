import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  erreur = '';
  envoi = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.envoi) return;
    this.erreur = '';
    this.envoi = true;
    this.authService.connecter({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: (response) => {
        this.authService.sauvegarderToken(response.token);

        const role = this.authService.getRole();

        if (role === 'association') {
          this.router.navigate(['/mes-campagnes']);
        } else if (role === 'admin') {
          this.router.navigate(['/admin/associations']);
        } else {
          this.router.navigate(['/signalement']); // citoyen
        }
      },
      error: (err) => {
        this.erreur = err.error?.erreur ?? err.error?.message ?? 'Erreur lors de la connexion.';
        this.envoi = false;
      }
    });
  }
}