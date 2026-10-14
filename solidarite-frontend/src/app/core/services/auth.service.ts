import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  inscrire(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscription`, userData);
  }

  connecter(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/connexion`, credentials);
  }

  sauvegarderToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  deconnecter(): void {
    localStorage.removeItem('token');
  }
}