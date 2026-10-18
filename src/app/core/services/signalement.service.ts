import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

/** Signalement brut renvoyé par l'API (les champs varient selon le backend). */
export interface Signalement {
  id: number;
  titre?: string;
  description?: string;
  categorie?: string;
  adresse?: string;
  lieu?: string;
  latitude?: string | number;
  longitude?: string | number;
  created_at?: string;
  date_creation?: string;
  date_signalement?: string;
  statut?: string;
  anonyme?: boolean;
  est_anonyme?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  // NOTE : la création utilise /api/reports, la liste /api/signalement.
  // À harmoniser côté backend (voir aussi le contrat de l'API).
  private apiCreation = `${inject(API_BASE)}/api/reports`;
  private apiListe = `${inject(API_BASE)}/api/signalement`;

  constructor(private http: HttpClient) {}

  creerSignalement(formData: FormData): Observable<unknown> {
    return this.http.post(this.apiCreation, formData);
  }

  lister(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(this.apiListe);
  }
}
