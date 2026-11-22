import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface ModerationSignalement {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  statut: string;
  ville?: string;
  est_anonyme: boolean;
  created_at: string;
  date_prise_en_charge?: string;
  date_resolution?: string;
  nom_association?: string;
  citoyen_nom?: string;
  citoyen_email?: string;
}

export interface ModerationListResponse {
  total: number;
  page: number;
  limit: number;
  signalements: ModerationSignalement[];
}

@Injectable({ providedIn: 'root' })
export class ModerationService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/admin/moderation/signalements`;

  lister(statut?: string, page = 1, limit = 20): Observable<ModerationListResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (statut) params = params.set('statut', statut);
    return this.http.get<ModerationListResponse>(this.api, { params });
  }

  getDetails(id: number): Observable<ModerationSignalement> {
    return this.http.get<ModerationSignalement>(`${this.api}/${id}`);
  }

  changerStatut(id: number, statut: string, commentaire?: string): Observable<{ message: string; signalement: ModerationSignalement }> {
    return this.http.patch<{ message: string; signalement: ModerationSignalement }>(`${this.api}/${id}/statut`, { statut, commentaire });
  }

  supprimer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
