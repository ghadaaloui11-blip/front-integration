import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface DocumentAssociation {
  id: number;
  type_document: string;
  nom_original: string;
  date_depot: string;
}

export interface DocumentAdmin extends DocumentAssociation {
  chemin_fichier: string;
}

export interface AssociationAdmin {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  nom_association: string;
  adresse: string;
  matricule_fiscal: string;
  statut_validation: 'pending' | 'approuve' | 'refuse';
  commentaire_admin: string | null;
  date_validation: string | null;
  nb_documents: number;
}

export interface StatutValidation {
  statut_validation: 'pending' | 'approuve' | 'refuse';
  commentaire_admin: string | null;
  date_validation: string | null;
}

@Injectable({ providedIn: 'root' })
export class AssociationService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/associations`;

  // ─── US02 : Association ──────────────────────────────────────────────────

  /** Statut de validation de l'association connectée */
  getMonStatut(): Observable<StatutValidation> {
    return this.http.get<StatutValidation>(`${this.api}/mon-statut`);
  }

  /** Déposer un document légal */
  deposerDocument(typeDocument: string, fichier: File): Observable<unknown> {
    const form = new FormData();
    form.append('type_document', typeDocument);
    form.append('document', fichier);
    return this.http.post(`${this.api}/documents`, form);
  }

  /** Lister mes documents */
  getMesDocuments(): Observable<DocumentAssociation[]> {
    return this.http.get<DocumentAssociation[]>(`${this.api}/documents`);
  }

  /** Supprimer un de mes documents */
  supprimerDocument(id: number): Observable<unknown> {
    return this.http.delete(`${this.api}/documents/${id}`);
  }

  // ─── US03 : Admin ────────────────────────────────────────────────────────

  /** Lister toutes les associations (admin), optionnel ?statut= */
  listerAssociations(statut?: string): Observable<AssociationAdmin[]> {
    const params = statut && statut !== 'all' ? `?statut=${statut}` : '';
    return this.http.get<AssociationAdmin[]>(`${this.api}${params}`);
  }

  /** Documents d'une association (admin) */
  getDocumentsAssociation(id: number): Observable<DocumentAdmin[]> {
    return this.http.get<DocumentAdmin[]>(`${this.api}/${id}/documents`);
  }

  /** Valider ou refuser une association (admin) */
  validerAssociation(id: number, statut: 'approuve' | 'refuse', commentaire?: string): Observable<unknown> {
    return this.http.patch(`${this.api}/${id}/validation`, { statut, commentaire });
  }
}

/** Libellé français d'un statut de validation (partagé admin + dépôt de documents). */
export function statutLabel(statut: string): string {
  const map: Record<string, string> = {
    pending: 'En attente de validation',
    approuve: 'Approuvée',
    refuse: 'Refusée',
  };
  return map[statut] ?? statut;
}
