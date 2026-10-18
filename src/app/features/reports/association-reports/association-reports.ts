import { Component, OnInit, inject, signal } from '@angular/core';
import { Signalement, SignalementService } from '../../../core/services/signalement.service';

/** Signalement normalisé pour l'affichage. */
export interface SignalementFormate {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  classe: string;
  lieu: string;
  date: string;
  statut: string;
  anonyme: boolean;
}

@Component({
  selector: 'app-association-reports',
  imports: [],
  templateUrl: './association-reports.html',
  styleUrl: './association-reports.css',
})
export class AssociationReportsComponent implements OnInit {
  private signalements = inject(SignalementService);

  reports = signal<SignalementFormate[]>([]);
  loading = signal(true);
  error = signal('');

  selected: SignalementFormate | null = null;

  ngOnInit() {
    this.signalements.lister().subscribe({
      next: (data) => {
        this.reports.set(data.map((s) => this.preparer(s)));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.erreur ?? e.error?.message ?? 'Impossible de charger les signalements.');
        this.loading.set(false);
      },
    });
  }

  // Met les champs au même format, quel que soit le nom de colonne
  preparer(s: Signalement): SignalementFormate {
    let lieu = s.adresse || s.lieu || '';
    if (!lieu && s.latitude && s.longitude) {
      lieu = `${s.latitude}, ${s.longitude}`;
    }

    return {
      id: s.id,
      titre: s.titre || s.description || `Signalement #${s.id}`,
      description: s.description || '',
      categorie: s.categorie || '',
      classe: this.classeCategorie(s.categorie),
      lieu: lieu,
      date: s.created_at || s.date_creation || s.date_signalement || '',
      statut: s.statut || 'Reçu',
      anonyme: !!(s.anonyme ?? s.est_anonyme),
    };
  }

  classeCategorie(categorie?: string): string {
    const c = (categorie || '').toLowerCase();
    if (c.includes('sant')) return 'sante';
    if (c.includes('urgen')) return 'urgence';
    if (c.includes('social')) return 'social';
    return '';
  }

  tempsEcoule(date: string): string {
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
