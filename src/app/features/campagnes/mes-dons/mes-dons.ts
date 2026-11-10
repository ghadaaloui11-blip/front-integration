import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonsService, MonDon } from '../../../core/services/dons.service';

@Component({
  selector: 'app-mes-dons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mes-dons.html',
  styleUrl: './mes-dons.css',
})
export class MesDonsComponent implements OnInit {
  private service = inject(DonsService);

  dons    = signal<MonDon[]>([]);
  loading = signal(true);
  error   = signal('');

  // Totaux calculés
  totalDonne  = signal(0);
  nbCampagnes = signal(0);

  ngOnInit() {
    this.service.getMesDons().subscribe({
      next: (data) => {
        this.dons.set(data);
        this.totalDonne.set(data.reduce((s, d) => s + Number(d.montant), 0));
        const ids = new Set(data.map(d => d.campagne_id));
        this.nbCampagnes.set(ids.size);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.erreur ?? 'Impossible de charger votre historique de dons.');
        this.loading.set(false);
      },
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
