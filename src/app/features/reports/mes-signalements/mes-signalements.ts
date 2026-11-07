import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_BASE } from '../../../core/config/api-base.token';
import {
  Signalement,
  SignalementService,
  classeStatut,
  labelStatut,
} from '../../../core/services/signalement.service';

/** US06 : le citoyen suit le statut de SES signalements (recu, en_cours, resolu). */
@Component({
  selector: 'app-mes-signalements',
  imports: [RouterLink],
  templateUrl: './mes-signalements.html',
  styleUrl: './mes-signalements.css',
})
export class MesSignalementsComponent implements OnInit {
  private signalements = inject(SignalementService);
  private apiBase = inject(API_BASE);

  reports = signal<Signalement[]>([]);
  loading = signal(true);
  error = signal('');

  // Exposés pour le template
  labelStatut = labelStatut;
  classeStatut = classeStatut;

  ngOnInit() {
    this.signalements.listerMes().subscribe({
      next: (data) => {
        this.reports.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(
          e.error?.erreur ?? e.error?.message ?? 'Impossible de charger vos signalements.'
        );
        this.loading.set(false);
      },
    });
  }

  titreDe(s: Signalement): string {
    return s.titre || s.description || `Signalement #${s.id}`;
  }

  photoUrl(s: Signalement): string | null {
    return s.photo ? `${this.apiBase}/${s.photo}` : null;
  }

  formaterDate(date?: string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR');
  }
}
