import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface MonDon {
  id: number;
  reference: string;
  montant: number;
  est_anonyme: boolean;
  nom: string | null;
  message: string | null;
  date: string;
  statut: string;
  campagne_id: number;
  campagne_titre: string;
  association_nom: string | null;
}

@Injectable({ providedIn: 'root' })
export class DonsService {
  private http = inject(HttpClient);
  private api  = `${inject(API_BASE)}/api/campagnes`;

  // US31 : historique des dons du citoyen connecté
  getMesDons(): Observable<MonDon[]> {
    return this.http.get<MonDon[]>(`${this.api}/mes-dons`);
  }
}
