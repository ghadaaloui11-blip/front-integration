import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

/** US26 : un defi du catalog. */
export interface Defi {
  id: number;
  titre: string;
  description: string | null;
  categorie: string | null;
  mode: 'automatique' | 'manuelle';
  type_activite: string | null;
  objectif: number;
  recompense_points: number;
  icone: string;
  date_debut: string | null;
  date_fin: string | null;
  statut: string;
  created_at: string;
}

/** US26 : participation d'un utilisateur a un defi. */
export interface ParticipationDefi {
  id: number;
  defi_id: number;
  statut: 'en_cours' | 'en_attente' | 'complete' | 'rejete';
  progression: number;
  photo_preuve?: string | null;
  commentaire?: string | null;
  created_at: string;
  completed_at?: string | null;
  titre?: string;
  icone?: string;
  objectif?: number;
  recompense_points?: number;
  mode?: 'automatique' | 'manuelle';
}

export interface FiltresDefi {
  categorie?: string;
  search?: string;
  statut?: string;
}

@Injectable({ providedIn: 'root' })
export class DefiService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/defis`;

  lister(filtres: FiltresDefi = {}): Observable<Defi[]> {
    let params = new HttpParams();
    if (filtres.categorie && filtres.categorie !== 'Toutes') {
      params = params.set('categorie', filtres.categorie);
    }
    if (filtres.search) params = params.set('search', filtres.search);
    if (filtres.statut) params = params.set('statut', filtres.statut);
    return this.http.get<Defi[]>(this.api, { params });
  }

  voir(id: number): Observable<Defi> {
    return this.http.get<Defi>(`${this.api}/${id}`);
  }

  rejoindre(id: number): Observable<ParticipationDefi> {
    return this.http.post<ParticipationDefi>(`${this.api}/${id}/rejoindre`, {});
  }

  mesParticipations(): Observable<ParticipationDefi[]> {
    return this.http.get<ParticipationDefi[]>(`${this.api}/mes`);
  }

  soumettrePreuve(id: number, fichier: File, commentaire?: string): Observable<ParticipationDefi> {
    const form = new FormData();
    form.append('photo', fichier);
    if (commentaire) form.append('commentaire', commentaire);
    return this.http.post<ParticipationDefi>(`${this.api}/${id}/preuve`, form);
  }
}
