import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

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
  /** Renseigné par GET /api/campagnes (liste publique). */
  association_nom?: string;
}

/** Association telle que renvoyée par GET /api/campagnes/associations. */
export interface AssociationListee {
  id: number;
  nom?: string;
  nom_association?: string;
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
  private api = `${inject(API_BASE)}/api/campagnes`;

  getAll(): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(this.api);
  }

  getAssociations(): Observable<AssociationListee[]> {
    return this.http.get<AssociationListee[]>(`${this.api}/associations`);
  }

  getMesCampagnes(): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(`${this.api}/mes-campagnes`);
  }

  create(data: Partial<Campagne>): Observable<unknown> {
    return this.http.post(this.api, data);
  }

  getAvancement(id: number): Observable<Avancement> {
    return this.http.get<Avancement>(`${this.api}/${id}/avancement`);
  }

  addUtilisation(id: number, data: { libelle: string; montant: number }): Observable<unknown> {
    return this.http.post(`${this.api}/${id}/utilisation`, data);
  }
}

/** Pourcentage collecté (0–100), protégé contre la division par zéro. */
export function pourcentageCampagne(c: Pick<Campagne, 'objectif_montant' | 'montant_collecte'>): number {
  const objectif = Number(c.objectif_montant);
  if (!objectif) return 0;
  return Math.min(100, Math.round((Number(c.montant_collecte) / objectif) * 100));
}