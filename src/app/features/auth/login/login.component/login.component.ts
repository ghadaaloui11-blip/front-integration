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

        const role = this.authService.getRole();

        if (role === 'association') {
          this.router.navigate(['/mes-campagnes']);
        } else if (role === 'admin') {
          this.router.navigate(['/campagnes']); // à remplacer par la page admin du Membre 1
        } else {
          this.router.navigate(['/signalement']); // citoyen
        }
      },
      error: (err: { error: { erreur: string; }; }) => {
        this.erreur = err.error?.erreur || 'Erreur lors de la connexion.';
      }
    });
  }
}