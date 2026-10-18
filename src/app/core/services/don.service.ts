import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
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

  // Le backend expose maintenant POST /api/campagnes/:id/don (US11)
  private static readonly MOCKED = false;

  creerDon(campagneId: number, data: DonRequest): Observable<Don> {
    if (!Number.isFinite(data.montant) || data.montant <= 0) {
      return throwError(() => ({ error: { erreur: 'Le montant du don doit être supérieur à 0.' } }));
    }

    if (DonService.MOCKED) {
      return this.mockCreerDon(campagneId, data);
    }

    return this.http.post<Don>(`${this.api}/${campagneId}/don`, data);
  }

  private mockCreerDon(campagneId: number, data: DonRequest): Observable<Don> {
    const now = new Date();
    const don: Don = {
      id: Math.floor(Math.random() * 1_000_000),
      reference: `DON-${now.getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      campagne_id: campagneId,
      montant: data.montant,
      est_anonyme: data.est_anonyme,
      nom: data.est_anonyme ? null : (data.nom ?? null),
      message: data.message?.trim() ? data.message.trim() : null,
      date: now.toISOString(),
      statut: 'Don enregistré (paiement simulé)',
    };
    return of(don).pipe(delay(600));
  }
}
