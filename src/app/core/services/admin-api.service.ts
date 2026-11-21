import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api-base.token';

export interface LigneStatut {
  statut: string;
  total: number;
}

export interface LigneRole {
  role: string;
  total: number;
}

export interface StatsAdmin {
  utilisateurs: {
    total: number;
    parRole: LigneRole[];
  };
  benevoles: number;
  signalements: LigneStatut[];
  demandesAide: LigneStatut[];
  donsNature: LigneStatut[];
  campagnes?: number;
  dons?: number;
  evenements?: number;
  inscriptions?: number;
}

export interface UtilisateurAdmin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private api = this.base + '/api/admin';

  stats() {
    return this.http.get<StatsAdmin>(this.api + '/stats');
  }

  utilisateurs(q: string, page: number) {
    return this.http.get<UtilisateurAdmin[]>(this.api + '/utilisateurs', {
      params: { q: q, page: page, limit: 10 },
    });
  }

  changerStatutUtilisateur(id: number, actif: boolean) {
    return this.http.patch<{ id: number; actif: boolean }>(
      this.api + '/utilisateurs/' + id + '/statut',
      { actif: actif }
    );
  }
}