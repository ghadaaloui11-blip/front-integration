import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface DemandeAideForm {
  categorie: string;
  description: string;
  ville: string;
  telephone: string;
  associationId: number | null;
}

export interface DemandeAide {
  id: number;
  categorie: string;
  description: string;
  ville: string;
  telephone: string | null;
  statut: 'recue' | 'acceptee' | 'refusee';
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeAideService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/demandes-aide`;

  /** US28 : envoyer une demande (avec ou sans compte citoyen). */
  envoyer(data: DemandeAideForm): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.api, data);
  }

  /** Association : lister les demandes reçues. */
  lister(): Observable<DemandeAide[]> {
    return this.http.get<DemandeAide[]>(this.api);
  }

  /** Association : accepter ou refuser. */
  changerStatut(id: number, statut: 'acceptee' | 'refusee'): Observable<unknown> {
    return this.http.patch(`${this.api}/${id}/statut`, { statut: statut });
  }
}