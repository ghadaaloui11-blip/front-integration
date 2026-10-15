import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Campagne, CampagneService } from '../../../core/services/campagne.service';

@Component({
  selector: 'app-campagne-list',
  imports: [RouterLink],
  templateUrl: './campagne-list.html',
  styleUrl: './campagne-list.css',
})
export class CampagneList implements OnInit {
  private service = inject(CampagneService);

  campagnes = signal<Campagne[]>([]);
  associations = signal<any[]>([]);
  loading = signal(true);
  error = signal('');

  onglet = 'toutes';

  ngOnInit() {
    this.service.getAll().subscribe({
      next: (data) => { this.campagnes.set(data); this.loading.set(false); },
      error: () => { this.error.set('Impossible de charger les campagnes.'); this.loading.set(false); },
    });
    this.service.getAssociations().subscribe({
      next: (data) => this.associations.set(data),
    });
  }

  pourcentage(c: Campagne): number {
    const objectif = Number(c.objectif_montant);
    if (!objectif) return 0;
    return Math.min(100, Math.round((Number(c.montant_collecte) / objectif) * 100));
  }
}