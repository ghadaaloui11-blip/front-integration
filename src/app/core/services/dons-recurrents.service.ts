import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface DonRecurrent {
  id: number;
  citoyen_id: number;
  campagne_id: number;
  montant: number;
  periodicite: 'mensuel' | 'trimestriel' | 'annuel';
  actif: boolean;
  date_debut: string;
  date_fin?: string;
  created_at: string;
  campagne_titre?: string;
  campagne_statut?: string;
}

export interface CreerDonRecurrentPayload {
  campagne_id: number;
  montant: number;
  periodicite: 'mensuel' | 'trimestriel' | 'annuel';
  date_debut?: string;
  date_fin?: string;
}

@Injectable({ providedIn: 'root' })
export class DonsRecurrentsService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/dons-recurrents`;

  getMesDonsRecurrents(): Observable<DonRecurrent[]> {
    return this.http.get<DonRecurrent[]>(this.api);
  }

  creer(payload: CreerDonRecurrentPayload): Observable<{ message: string; don: DonRecurrent }> {
    return this.http.post<{ message: string; don: DonRecurrent }>(this.api, payload);
  }

  annuler(id: number): Observable<{ message: string; don: DonRecurrent }> {
    return this.http.patch<{ message: string; don: DonRecurrent }>(`${this.api}/${id}/annuler`, {});
  }

  listerTousAdmin(): Observable<DonRecurrent[]> {
    return this.http.get<DonRecurrent[]>(`${this.api}/admin`);
  }
}
