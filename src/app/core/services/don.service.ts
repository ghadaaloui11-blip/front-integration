import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface DonRequest {
  montant: number;
  est_anonyme: boolean;
  nom?: string;
  message?: string;
}

export interface Don {
  id: number;
  reference: string;
  campagne_id: number;
  montant: number;
  est_anonyme: boolean;
  nom: string | null;
  message: string | null;
  date: string;
  statut: string;
}

@Injectable({ providedIn: 'root' })
export class DonService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/campagnes`;

  creerDon(campagneId: number, data: DonRequest): Observable<Don> {
    if (!Number.isFinite(data.montant) || data.montant <= 0) {
      return throwError(() => ({ error: { erreur: 'Le montant du don doit être supérieur à 0.' } }));
    }
    return this.http.post<Don>(`${this.api}/${campagneId}/don`, data);
  }
}
