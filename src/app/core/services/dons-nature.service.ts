import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface DonNature {
  id: number;
  type_don: string;
  description: string;
  quantite: string | null;
  ville: string;
  statut: 'propose' | 'accepte' | 'collecte' | 'refuse' | 'annule';
  date_collecte: string | null;
  lieu_collecte: string | null;
  commentaire: string | null;
  created_at: string;
  nom_association: string | null;
  association_id: number | null;
}

export interface ProposerDonNaturePayload {
  type_don: string;
  description: string;
  quantite?: string;
  ville: string;
}

export const TYPES_DON = ['Vêtements', 'Nourriture', 'Matériel', 'Mobilier', 'Médicaments', 'Jouets', 'Autre'];

export function labelStatutDon(statut: string): string {
  switch (statut) {
    case 'propose':  return 'En attente';
    case 'accepte':  return 'Accepté';
    case 'collecte': return 'Collecté';
    case 'refuse':   return 'Refusé';
    case 'annule':   return 'Annulé';
    default:         return statut;
  }
}

export function classeStatutDon(statut: string): string {
  switch (statut) {
    case 'propose':  return 'badge-propose';
    case 'accepte':  return 'badge-accepte';
    case 'collecte': return 'badge-collecte';
    case 'refuse':   return 'badge-refuse';
    case 'annule':   return 'badge-annule';
    default:         return '';
  }
}

@Injectable({ providedIn: 'root' })
export class DonsNatureService {
  private http = inject(HttpClient);
  private api  = `${inject(API_BASE)}/api/dons-nature`;

  // US13 : proposer un don en nature (citoyen)
  proposer(data: ProposerDonNaturePayload): Observable<{ don: DonNature }> {
    return this.http.post<{ don: DonNature }>(this.api, data);
  }

  // US13 : historique des dons en nature du citoyen
  mesDons(): Observable<DonNature[]> {
    return this.http.get<DonNature[]>(`${this.api}/mes-dons`);
  }

  // Annuler un don "proposé"
  annuler(id: number): Observable<{ don: DonNature }> {
    return this.http.patch<{ don: DonNature }>(`${this.api}/${id}/annuler`, {});
  }
}
