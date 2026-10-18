import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface Identifiants {
  email: string;
  motDePasse: string;
}

export interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  role: string;
  adresse: string;
  nomAssociation?: string;
  matriculeFiscal?: string;
}

export interface ReponseAuth {
  token: string;
}

/** Claims utiles du JWT (décodés côté client, le backend reste la source de vérité). */
export interface JwtPayload {
  role?: string;
  nom?: string;
  prenom?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${inject(API_BASE)}/api/auth`;

  inscrire(userData: InscriptionData): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.apiUrl}/inscription`, userData);
  }

  connecter(credentials: Identifiants): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.apiUrl}/connexion`, credentials);
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
  getRole(): string | null {
    return this.decodePayload()?.role ?? null;
  }

  getNom(): string | null {
    const payload = this.decodePayload();
    if (!payload) return null;
    if (payload.nom && payload.prenom) return `${payload.prenom} ${payload.nom}`;
    if (payload.nom) return String(payload.nom);
    if (payload.email) return String(payload.email);
    return null;
  }

  private decodePayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }
}