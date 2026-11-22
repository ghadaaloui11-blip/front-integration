import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface FilActualiteItem {
  type: 'campagne' | 'evenement' | 'signalement_resolu';
  id: string;
  titre: string;
  description: string;
  auteur?: string;
  date: string;
  statut?: string;
  montant_objectif?: number;
  montant_collecte?: number;
  ville?: string;
  categorie?: string;
}

export interface FilActualiteResponse {
  page: number;
  limit: number;
  items: FilActualiteItem[];
}

@Injectable({ providedIn: 'root' })
export class FilActualitesService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/fil-actualites`;

  lister(page = 1, limit = 20): Observable<FilActualiteResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<FilActualiteResponse>(this.api, { params });
  }
}
