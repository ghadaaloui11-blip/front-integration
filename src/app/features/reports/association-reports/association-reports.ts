import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-association-reports',
  imports: [],
  templateUrl: './association-reports.html',
  styleUrl: './association-reports.css',
})
export class AssociationReports implements OnInit {
  private http = inject(HttpClient);
  private api = 'http://localhost:5000/api/signalement';

  reports = signal<any[]>([]);
  loading = signal(true);
  error = signal('');

  selected: any = null;

  ngOnInit() {
    this.http.get<any[]>(this.api).subscribe({
      next: (data) => {
        const liste: any[] = [];
        for (let i = 0; i < data.length; i++) {
          liste.push(this.preparer(data[i]));
        }
        this.reports.set(liste);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Impossible de charger les signalements.');
        this.loading.set(false);
      },
    });
  }

  // Met les champs au même format, quel que soit le nom de colonne
  preparer(s: any): any {
    let lieu = s.adresse || s.lieu || '';
    if (!lieu && s.latitude && s.longitude) {
      lieu = s.latitude + ', ' + s.longitude;
    }

    return {
      id: s.id,
      titre: s.titre || s.description || 'Signalement #' + s.id,
      description: s.description || '',
      categorie: s.categorie || '',
      classe: this.classeCategorie(s.categorie),
      lieu: lieu,
      date: s.created_at || s.date_creation || s.date_signalement || '',
      statut: s.statut || 'Reçu',
      anonyme: s.anonyme || s.est_anonyme,
    };
  }

  classeCategorie(categorie: string): string {
    const c = (categorie || '').toLowerCase();
    if (c.indexOf('sant') !== -1) return 'sante';
    if (c.indexOf('urgen') !== -1) return 'urgence';
    if (c.indexOf('social') !== -1) return 'social';
    return '';
  }

  tempsEcoule(date: string): string {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const heures = Math.floor(diff / 3600000);
    if (heures < 1) return 'il y a moins d\'1 h';
    if (heures < 24) return 'il y a ' + heures + ' h';
    const jours = Math.floor(heures / 24);
    if (jours === 1) return 'hier';
    return 'il y a ' + jours + ' j';
  }
}