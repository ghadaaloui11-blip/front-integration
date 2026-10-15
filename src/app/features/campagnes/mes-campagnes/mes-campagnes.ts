import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Campagne, CampagneService } from '../../../core/services/campagne.service';

@Component({
  selector: 'app-mes-campagnes',
  imports: [RouterLink],
  templateUrl: './mes-campagnes.html',
  styleUrl: './mes-campagnes.css',
})
export class MesCampagnes implements OnInit {
  private service = inject(CampagneService);

  campagnes = signal<Campagne[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.getMesCampagnes().subscribe({
      next: (d) => { this.campagnes.set(d); this.loading.set(false); },
      error: (e) => {
        this.error.set(e.error?.message ?? 'Impossible de charger vos campagnes.');
        this.loading.set(false);
      },
    });
  }

  pourcentage(c: Campagne): number {
    const objectif = Number(c.objectif_montant);
    if (!objectif) return 0;
    return Math.min(100, Math.round((Number(c.montant_collecte) / objectif) * 100));
  }
}