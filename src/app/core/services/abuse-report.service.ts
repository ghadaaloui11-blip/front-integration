import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

/** Types de contenu signalables (doivent rester synchronisés avec le backend). */
export const TYPES_CONTENU_ABUSIF = [
  { valeur: 'campagne', label: 'Campagne' },
  { valeur: 'evenement', label: 'Événement' },
  { valeur: 'signalement', label: 'Signalement' },
  { valeur: 'association', label: 'Association' },
] as const;

export type TypeContenuAbusif = (typeof TYPES_CONTENU_ABUSIF)[number]['valeur'];

export const MOTIFS_ABUS = [
  { valeur: 'haine', label: 'Discours haineux' },
  { valeur: 'harcelement', label: 'Harcèlement' },
  { valeur: 'fraude', label: 'Fraude / escroquerie' },
  { valeur: 'contenu_inapproprie', label: 'Contenu inapproprié' },
  { valeur: 'spam', label: 'Spam / publicité' },
  { valeur: 'autre', label: 'Autre' },
] as const;

export type MotifAbus = (typeof MOTIFS_ABUS)[number]['valeur'];

export interface SignalementAbuse {
  id: number;
  type_cible: TypeContenuAbusif;
  cible_id: number;
  titre_cible: string | null;
  motif: MotifAbus;
  description: string | null;
  statut: 'recu' | 'en_cours' | 'resolu' | 'rejete';
  decision: string | null;
  signalant_id: number;
  signalant_nom?: string;
  signalant_prenom?: string;
  signalant_email?: string;
  admin_id?: number | null;
  admin_nom?: string | null;
  date_creation: string;
  date_traitement?: string | null;
  contenu_supprime: boolean;
  total?: number;
}

export interface NouveauSignalementAbuse {
  type_cible: TypeContenuAbusif;
  cible_id: number;
  motif: MotifAbus;
  description?: string;
}

export interface ListeSignalementsAbuse {
  total: number;
  page: number;
  limit: number;
  signalements: SignalementAbuse[];
}

export interface MesSignalementsAbuse {
  total: number;
  signalements: SignalementAbuse[];
}

@Injectable({ providedIn: 'root' })
export class AbuseReportService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api`;

  /** US30 : l'utilisateur connecté signale un contenu abusif. */
  signaler(donnees: NouveauSignalementAbuse): Observable<{
    message: string;
    signalement: SignalementAbuse;
  }> {
    return this.http.post<{ message: string; signalement: SignalementAbuse }>(
      `${this.api}/signalements-abuse`,
      donnees
    );
  }

  /** Suivi des signalements déposés par l'utilisateur connecté. */
  mesSignalements(page = 1, limit = 20): Observable<MesSignalementsAbuse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<MesSignalementsAbuse>(`${this.api}/signalements-abuse/mes`, { params });
  }

  /** US31 : file d'examen réservée à l'administrateur. */
  listerAdministration(
    filtres: { statut?: string; type?: string; page?: number; limit?: number } = {}
  ): Observable<ListeSignalementsAbuse> {
    let params = new HttpParams();
    if (filtres.statut) params = params.set('statut', filtres.statut);
    if (filtres.type) params = params.set('type', filtres.type);
    if (filtres.page) params = params.set('page', filtres.page);
    if (filtres.limit) params = params.set('limit', filtres.limit);
    return this.http.get<ListeSignalementsAbuse>(`${this.api}/admin/signalements-abuse`, {
      params,
    });
  }

  voirAdministration(id: number): Observable<SignalementAbuse> {
    return this.http.get<SignalementAbuse>(`${this.api}/admin/signalements-abuse/${id}`);
  }

  /** US31 : prise en charge / résolution / classement sans suite. */
  changerStatut(
    id: number,
    statut: string,
    decision?: string
  ): Observable<{ message: string; signalement: SignalementAbuse }> {
    return this.http.patch<{ message: string; signalement: SignalementAbuse }>(
      `${this.api}/admin/signalements-abuse/${id}/statut`,
      { statut, decision }
    );
  }

  /** US32 : suppression du contenu jugé abusif. */
  supprimerContenu(
    id: number
  ): Observable<{ message: string; signalement: SignalementAbuse }> {
    return this.http.delete<{ message: string; signalement: SignalementAbuse }>(
      `${this.api}/admin/signalements-abuse/${id}/contenu`
    );
  }

  libelleType(type: string): string {
    return TYPES_CONTENU_ABUSIF.find((t) => t.valeur === type)?.label ?? type;
  }

  libelleMotif(motif: string): string {
    return MOTIFS_ABUS.find((m) => m.valeur === motif)?.label ?? motif;
  }

  libelleStatut(statut: string): string {
    switch (statut) {
      case 'recu':
        return 'Reçu';
      case 'en_cours':
        return 'En cours';
      case 'resolu':
        return 'Résolu';
      case 'rejete':
        return 'Classé sans suite';
      default:
        return statut;
    }
  }
}
