import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService, Evenement, Participant } from '../../../core/services/event.service';

@Component({
  selector: 'app-mes-evenements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mes-evenements.html',
  styleUrl: './mes-evenements.css',
})
export class MesEvenementsComponent implements OnInit {
  private eventService = inject(EventService);

  evenements = signal<Evenement[]>([]);
  loading = signal(true);
  error = signal('');
  successMsg = signal('');

  // Gestion des participants pour l'événement sélectionné (US18 / US35)
  selectedEvent = signal<Evenement | null>(null);
  participants = signal<Participant[]>([]);
  loadingParticipants = signal(false);
  participantActionLoading = signal<number | null>(null);

  ngOnInit() {
    this.chargerMesEvenements();
  }

  chargerMesEvenements() {
    this.loading.set(true);
    this.error.set('');
    this.eventService.getMyEvents().subscribe({
      next: (data) => {
        this.evenements.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Impossible de charger vos événements.');
        this.loading.set(false);
      },
    });
  }

  // US18 : Ouvrir et consulter la liste des participants
  ouvrirParticipants(event: Evenement) {
    this.selectedEvent.set(event);
    this.loadingParticipants.set(true);
    this.successMsg.set('');
    this.error.set('');

    this.eventService.getParticipants(event.id).subscribe({
      next: (res) => {
        this.participants.set(res.participants);
        this.loadingParticipants.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Impossible de charger la liste des participants.');
        this.loadingParticipants.set(false);
      },
    });
  }

  fermerParticipants() {
    this.selectedEvent.set(null);
    this.participants.set([]);
  }

  // US35 : Accepter ou refuser une candidature
  changerStatutParticipant(inscriptionId: number, nouveauStatut: 'accepte' | 'refuse') {
    const event = this.selectedEvent();
    if (!event) return;

    this.participantActionLoading.set(inscriptionId);
    this.error.set('');
    this.successMsg.set('');

    this.eventService.updateParticipantStatus(event.id, inscriptionId, nouveauStatut).subscribe({
      next: () => {
        this.participantActionLoading.set(null);
        this.successMsg.set(
          nouveauStatut === 'accepte'
            ? 'Candidature acceptée ! Le bénévole est confirmé pour l\'événement.'
            : 'Candidature refusée.'
        );
        // Rafraîchir les listes
        this.ouvrirParticipants(event);
        this.chargerMesEvenements();
      },
      error: (err) => {
        this.participantActionLoading.set(null);
        this.error.set(err.error?.erreur || 'Erreur lors de la mise à jour du statut.');
      },
    });
  }

  // Annuler un événement
  annulerEvenement(event: Evenement) {
    if (!confirm(`Êtes-vous sûr de vouloir annuler l'événement "${event.titre}" ?`)) {
      return;
    }

    this.eventService.updateStatut(event.id, 'annule').subscribe({
      next: () => {
        this.successMsg.set('Événement annulé.');
        this.chargerMesEvenements();
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Impossible d\'annuler l\'événement.');
      },
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }
}
