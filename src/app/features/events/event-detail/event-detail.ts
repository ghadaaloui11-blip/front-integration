import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService, Evenement } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShareButtonsComponent } from '../../../core/components/share-buttons/share-buttons.component';
import { ShareContent, ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ShareButtonsComponent],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private shareService = inject(ShareService);
  protected auth = inject(AuthService);

  event = signal<Evenement | null>(null);
  /** US19 : contenu de partage, construit des que l'evenement est charge. */
  shareContent = signal<ShareContent | null>(null);
  loading = signal(true);
  error = signal('');
  successMsg = signal('');
  submitting = signal(false);

  messageMotivation = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerEvenement(id);
    }
  }

  chargerEvenement(id: string | number) {
    this.loading.set(true);
    this.error.set('');
    this.eventService.getById(id).subscribe({
      next: (data) => {
        this.event.set(data);
        this.shareContent.set({
          title: data.titre,
          text: `Découvrez l'action solidaire « ${data.titre} » sur MennaFina.`,
          // Q15 : la page backend porte les balises OG et redirige vers le SPA.
          url: this.shareService.urlPartageEvenement(data.id),
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Événement introuvable.');
        this.loading.set(false);
      },
    });
  }

  // US34 : S'inscrire à l'événement
  participer() {
    const ev = this.event();
    if (!ev) return;

    this.error.set('');
    this.successMsg.set('');
    this.submitting.set(true);

    this.eventService.register(ev.id, this.messageMotivation).subscribe({
      next: (inscription) => {
        this.submitting.set(false);
        this.successMsg.set('Votre candidature a été envoyée avec succès ! L\'association va l\'examiner.');
        this.chargerEvenement(ev.id);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.erreur || 'Impossible de s\'inscrire à cet événement.');
      },
    });
  }

  // Annuler sa participation
  annulerInscription() {
    const ev = this.event();
    if (!ev) return;

    if (!confirm('Êtes-vous sûr de vouloir vous désister de cet événement ?')) {
      return;
    }

    this.submitting.set(true);
    this.eventService.cancelRegistration(ev.id).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMsg.set('Votre désistement a bien été pris en compte.');
        this.chargerEvenement(ev.id);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.erreur || 'Impossible d\'annuler l\'inscription.');
      },
    });
  }

  /** US19 : le partage n'est propose que pour les evenements publies. */
  peutPartager(): boolean {
    return this.event()?.statut === 'publie';
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }
}
