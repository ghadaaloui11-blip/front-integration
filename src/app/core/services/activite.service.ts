import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

/** US37 : une entree du journal d'activite prive de l'utilisateur. */
export interface Activite {
  id: number;
  type: string;
  ref_table: string;
  ref_id: number;
  libelle: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ActiviteService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/activites`;

  /** Le backend ignore tout :id et utilise exclusivement le JWT. */
  listerMes(page = 1, limit = 20): Observable<Activite[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<Activite[]>(`${this.api}/mes`, { params });
  }

  /** Libelle lisible d'un type d'activite (fallback sur le libelle serveur). */
  libelleType(type: string): string {
    const libelles: Record<string, string> = {
      don: 'Don financier',
      inscription_evenement_acceptee: 'Événement',
      don_nature_collecte: 'Don en nature',
      demande_aide: "Demande d'aide",
      signalement: 'Signalement',
      benevolat: 'Bénévolat',
      defi_complete: 'Défi réalisé',
    };
    return libelles[type] ?? type;
  }

  /** Icône simple, sans dependance externe. */
  icone(type: string): string {
    const icones: Record<string, string> = {
      don: 'bi bi-cash-stack',
      inscription_evenement_acceptee: 'bi bi-calendar-event',
      don_nature_collecte: 'bi bi-box-seam',
      demande_aide: 'bi bi-heart',
      signalement: 'bi bi-megaphone',
      benevolat: 'bi bi-people',
      defi_complete: 'bi bi-trophy',
    };
    return icones[type] ?? 'bi bi-circle';
  }

  estAnonyme(activite: Activite): boolean {
    return activite.metadata?.['est_anonyme'] === true;
  }
}
