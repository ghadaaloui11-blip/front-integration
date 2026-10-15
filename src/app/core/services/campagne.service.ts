import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Campagne {
  id: number;
  titre: string;
  description: string;
  objectif_montant: number;
  montant_collecte: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  association_id: number;
}

export interface UtilisationFonds {
  id: number;
  libelle: string;
  montant: string;
  date_utilisation: string;
}

export interface Avancement {
  campagne_id: number;
  titre: string;
  statut: string;
  objectif_montant: number;
  montant_collecte: number;
  pourcentage: number;
  montant_restant: number;
  jours_restants: number;
  total_utilise: number;
  solde_disponible: number;
  utilisation_fonds: UtilisationFonds[];
}

@Injectable({ providedIn: 'root' })
export class CampagneService {
  private http = inject(HttpClient);
  private api = 'http://localhost:5000/api/campagnes';

  getAll(): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(this.api);
  }

  getAssociations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/associations`);
  }

  getMesCampagnes(): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(`${this.api}/mes-campagnes`);
  }

  getOne(id: number): Observable<Campagne> {
    return this.http.get<Campagne>(`${this.api}/${id}`);
  }

  create(data: Partial<Campagne>): Observable<any> {
    return this.http.post(this.api, data);
  }

  getAvancement(id: number): Observable<Avancement> {
    return this.http.get<Avancement>(`${this.api}/${id}/avancement`);
  }

  addUtilisation(id: number, data: { libelle: string; montant: number }): Observable<any> {
    return this.http.post(`${this.api}/${id}/utilisation`, data);
  }
}