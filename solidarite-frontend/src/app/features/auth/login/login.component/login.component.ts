import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  erreur = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.connecter({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: (response: { token: any; }) => {
        this.authService.sauvegarderToken(response.token);
        alert('Connexion réussie !');
        // Rediriger vers la page de signalement ou tableau de bord
        this.router.navigate(['/signalement']);
      },
      error: (err: { error: { erreur: string; }; }) => {
        this.erreur = err.error.erreur || 'Erreur lors de la connexion.';
      }
    });
  }
}