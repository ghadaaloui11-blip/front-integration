import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

/** Signalement brut renvoyé par l'API (les champs varient selon le backend). */
export interface Signalement {
  id: number;
  titre?: string;
  description?: string;
  photo?: string | null;
  categorie?: string;
  adresse?: string;
  lieu?: string;
  latitude?: string | number;
  longitude?: string | number;
  created_at?: string;
  date_creation?: string;
  date_signalement?: string;
  statut?: StatutSignalement;
  anonyme?: boolean;
  est_anonyme?: boolean;
  // US32/US33 : responsable + jalons du cycle de vie
  association_id?: number | null;
  nom_association?: string | null;
  date_prise_en_charge?: string | null;
  date_resolution?: string | null;
  // Journal des changements de statut (US06/US33)
  historique?: HistoriqueStatut[];
}

/** Une entrée du journal de statut d'un signalement. */
export interface HistoriqueStatut {
  statut: StatutSignalement;
  date: string;
  nom_association?: string | null;
}

/** Les trois états du cycle de vie d'un signalement (contrainte SQL côté API). */
export type StatutSignalement = 'recu' | 'en_cours' | 'resolu';

/** Libellé FR partagé — une seule source de vérité pour toutes les vues. */
export function labelStatut(statut?: string): string {
  switch (statut) {
    case 'en_cours':
      return 'En cours';
    case 'resolu':
      return 'Résolu';
    default:
      return 'Reçu';
  }
}

/** Classe CSS du badge, pour un rendu cohérent du statut. */
export function classeStatut(statut?: string): string {
  switch (statut) {
    case 'en_cours':
      return 'statut-en-cours';
    case 'resolu':
      return 'statut-resolu';
    default:
      return 'statut-recu';
  }
}

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  // NOTE : la création utilise /api/reports, la liste /api/signalement.
  // À harmoniser côté backend (voir aussi le contrat de l'API).
  private apiCreation = `${inject(API_BASE)}/api/reports`;
  private apiSignalement = `${inject(API_BASE)}/api/signalement`;

  constructor(private http: HttpClient) {}

  creerSignalement(formData: FormData): Observable<unknown> {
    return this.http.post(this.apiCreation, formData);
  }

  /** US07 : liste complète — association/admin uniquement (endpoint protégé). */
  lister(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(`${this.apiSignalement}`);
  }

  /** Public : tous les signalements publiés, sans authentification (US06/US32). */
  listerPublic(statut?: string): Observable<Signalement[]> {
    const params = statut ? new HttpParams().set('statut', statut) : undefined;
    return this.http.get<Signalement[]>(`${this.apiSignalement}/public`, { params });
  }

  /** Public : détail d'un signalement publié. */
  voirPublic(id: number): Observable<Signalement> {
    return this.http.get<Signalement>(`${this.apiSignalement}/public/${id}`);
  }

  /** US06 : le citoyen suit SES signalements et leur statut. */
  listerMes(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(`${this.apiSignalement}/mes`);
  }

  /** US32 : les signalements dont l'association connectée est responsable. */
  listerPrisesEnCharge(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(`${this.apiSignalement}/mes-prises-en-charge`);
  }

  /** US32 : prendre la responsabilité d'un signalement disponible (statut « Reçu »). */
  prendreEnCharge(id: number): Observable<{ signalement: Signalement }> {
    return this.http.post<{ signalement: Signalement }>(
      `${this.apiSignalement}/${id}/prendre-en-charge`,
      {}
    );
  }

  /** US33 : l'association responsable fait évoluer le statut.
   *  en_cours -> resolu (résolution) ou resolu -> en_cours (réouverture). */
  changerStatut(id: number, statut: StatutSignalement): Observable<{ signalement: Signalement }> {
    return this.http.patch<{ signalement: Signalement }>(
      `${this.apiSignalement}/${id}/statut`,
      { statut }
    );
  }

  /** Obtenir un signalement par ID (pour édition) */
  getSignalement(id: number): Observable<Signalement> {
    return this.http.get<Signalement>(`${this.apiSignalement}/${id}`);
  }

  /** Mettre à jour un signalement */
  updateSignalement(id: number, formData: FormData): Observable<{ signalement: Signalement }> {
    return this.http.patch<{ signalement: Signalement }>(
      `${this.apiSignalement}/${id}`,
      formData
    );
  }

  /** Supprimer un signalement */
  deleteSignalement(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiSignalement}/${id}`);
  }
}
