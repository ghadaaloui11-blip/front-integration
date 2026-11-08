import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface Evenement {
  id: number;
  titre: string;
  description: string | null;
  date_evenement: string;
  lieu: string;
  ville: string;
  categorie: string;
  places_disponibles: number;
  statut: 'publie' | 'annule' | 'termine';
  association_id: number;
  association_nom?: string;
  association_email?: string;
  association_telephone?: string;
  created_at?: string;
  nb_inscrits_acceptes: number;
  nb_inscrits_attente: number;
  places_restantes: number;
  statut_mon_inscription?: 'en_attente' | 'accepte' | 'refuse' | 'annule' | null;
  mon_inscription_id?: number | null;
  mon_message_motivation?: string | null;
}

export interface Participant {
  inscription_id: number;
  evenement_id: number;
  citoyen_id: number;
  message_motivation: string | null;
  statut: 'en_attente' | 'accepte' | 'refuse' | 'annule';
  date_inscription: string;
  nom: string;
  prenom: string | null;
  email: string;
  telephone: string | null;
}

export interface ParticipantsResponse {
  evenement: {
    id: number;
    association_id: number;
    titre: string;
  };
  participants: Participant[];
}

export interface InscriptionResponse {
  id: number;
  evenement_id: number;
  citoyen_id: number;
  statut: 'en_attente' | 'accepte' | 'refuse' | 'annule';
  message_motivation: string | null;
  date_inscription: string;
}

export interface FiltresEvenement {
  ville?: string;
  categorie?: string;
  date?: string;
  search?: string;
  statut?: string;
}

export interface CreateEvenementPayload {
  titre: string;
  description?: string;
  date_evenement: string;
  lieu: string;
  ville: string;
  categorie: string;
  places_disponibles: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/evenements`;

  // US17 : Consulter et filtrer les événements
  getAll(filtres: FiltresEvenement = {}): Observable<Evenement[]> {
    let params = new HttpParams();
    if (filtres.ville) params = params.set('ville', filtres.ville);
    if (filtres.categorie && filtres.categorie !== 'Toutes') params = params.set('categorie', filtres.categorie);
    if (filtres.date) params = params.set('date', filtres.date);
    if (filtres.search) params = params.set('search', filtres.search);
    if (filtres.statut) params = params.set('statut', filtres.statut);

    return this.http.get<Evenement[]>(this.api, { params });
  }

  // Consulter le détail d'un événement
  getById(id: number | string): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.api}/${id}`);
  }

  // Événements de l'association connectée
  getMyEvents(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.api}/mes-evenements`);
  }

  // US16 : Créer un événement (Association)
  create(payload: CreateEvenementPayload): Observable<Evenement> {
    return this.http.post<Evenement>(this.api, payload);
  }

  // Changer le statut d'un événement (ex: annuler)
  updateStatut(id: number, statut: 'publie' | 'annule' | 'termine'): Observable<Evenement> {
    return this.http.patch<Evenement>(`${this.api}/${id}/statut`, { statut });
  }

  // US34 : S'inscrire à un événement (Citoyen)
  register(evenementId: number, messageMotivation?: string): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(`${this.api}/${evenementId}/inscriptions`, {
      message_motivation: messageMotivation || '',
    });
  }

  // Annuler sa participation (Citoyen)
  cancelRegistration(evenementId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${evenementId}/inscriptions`);
  }

  // US18 : Consulter la liste des participants inscrits (Association)
  getParticipants(evenementId: number): Observable<ParticipantsResponse> {
    return this.http.get<ParticipantsResponse>(`${this.api}/${evenementId}/participants`);
  }

  // US35 : Accepter ou refuser une candidature (Association)
  updateParticipantStatus(
    evenementId: number,
    inscriptionId: number,
    statut: 'accepte' | 'refuse'
  ): Observable<{ id: number; statut: string }> {
    return this.http.patch<{ id: number; statut: string }>(
      `${this.api}/${evenementId}/participants/${inscriptionId}`,
      { statut }
    );
  }
}
