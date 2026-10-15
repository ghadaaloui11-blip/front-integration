import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  auth = inject(AuthService);

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login') || url.startsWith('/inscription');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}