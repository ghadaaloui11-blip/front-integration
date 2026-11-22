import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

/** US24 : un badge deja obtenu par l'utilisateur. */
export interface BadgeObtenu {
  code: string;
  nom: string;
  description: string;
  icone: string;
  obtenu_le: string;
}

/** US24 : un badge encore a debloquer. */
export interface BadgeRestant {
  code: string;
  nom: string;
  description: string;
  icone: string;
}

/** US24 : solde d'engagement (toujours celui du JWT, cote serveur). */
export interface Engagement {
  solde: number;
  actions: number;
  badges: BadgeObtenu[];
  badges_restants: BadgeRestant[];
}

@Injectable({ providedIn: 'root' })
export class EngagementService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/engagement`;

  /** Le backend ignore tout identifiant : le solde est celui du token. */
  lireMoi(): Observable<Engagement> {
    return this.http.get<Engagement>(`${this.api}/moi`);
  }
}
