import { Component, OnInit, inject, signal } from '@angular/core';
import { API_BASE } from '../../../core/config/api-base.token';
import {
  Signalement,
  SignalementService,
  classeStatut,
  labelStatut,
} from '../../../core/services/signalement.service';

/** US06 / US32 : consultation PUBLIQUE des signalements (sans authentification). */
@Component({
  selector: 'app-public-reports',
  imports: [],
  templateUrl: './public-reports.html',
  styleUrl: './public-reports.css',
})
export class PublicReportsComponent implements OnInit {
  private signalements = inject(SignalementService);
  private apiBase = inject(API_BASE);

  reports = signal<Signalement[]>([]);
  loading = signal(true);
  error = signal('');
  filtreActif = signal<string>('');

  selected: Signalement | null = null;

  /** Filtres par statut : '' = tous. Le libellé passe par le filtre de l'API. */
  readonly filtres: { valeur: string; label: string }[] = [
    { valeur: '', label: 'Tous' },
    { valeur: 'recu', label: 'Reçus' },
    { valeur: 'en_cours', label: 'En cours' },
    { valeur: 'resolu', label: 'Résolus' },
  ];

  // Exposés pour le template
  labelStatut = labelStatut;
  classeStatut = classeStatut;

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set('');
    this.selected = null;

    this.signalements.listerPublic(this.filtreActif() || undefined).subscribe({
      next: (data) => {
        this.reports.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(
          e.error?.erreur ?? e.error?.message ?? 'Impossible de charger les signalements.'
        );
        this.loading.set(false);
      },
    });
  }

  definirFiltre(valeur: string) {
    if (this.filtreActif() === valeur) return;
    this.filtreActif.set(valeur);
    this.charger();
  }

  titreDe(s: Signalement): string {
    return s.titre || s.description || `Signalement #${s.id}`;
  }

  /** Photo servie par le backend : /uploads/photos/<fichier>. */
  photoUrl(s: Signalement): string | null {
    return s.photo ? `${this.apiBase}/${s.photo}` : null;
  }

  lieuDe(s: Signalement): string {
    if (s.adresse || s.lieu) return s.adresse || s.lieu || '';
    if (s.latitude != null && s.longitude != null) return `${s.latitude}, ${s.longitude}`;
    return '';
  }

  formaterDate(date?: string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR');
  }

  tempsEcoule(date?: string | null): string {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const heures = Math.floor(diff / 3600000);
    if (heures < 1) return "il y a moins d'1 h";
    if (heures < 24) return `il y a ${heures} h`;
    const jours = Math.floor(heures / 24);
    if (jours === 1) return 'hier';
    return `il y a ${jours} j`;
  }
}
