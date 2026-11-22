import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AssociationListee,
  Campagne,
  CampagneService,
  pourcentageCampagne,
} from '../../../core/services/campagne.service';
import {
  FilterBarComponent,
  FilterValues,
} from '../../../core/components/filter-bar/filter-bar.component';
import { CATEGORIES_CAMPAGNE } from '../../../core/constants/categories';

@Component({
  selector: 'app-campagne-list',
  imports: [RouterLink, FilterBarComponent],
  templateUrl: './campagne-list.html',
  styleUrl: './campagne-list.css',
})
export class CampagneListComponent implements OnInit {
  private service = inject(CampagneService);

  campagnes = signal<Campagne[]>([]);
  associations = signal<AssociationListee[]>([]);
  loading = signal(true);
  error = signal('');

  onglet = 'toutes';
  readonly categories = CATEGORIES_CAMPAGNE;

  ngOnInit() {
    this.charger();
    this.service.getAssociations().subscribe({
      next: (data) => this.associations.set(data),
    });
  }

  charger(filtres?: Partial<FilterValues>) {
    this.loading.set(true);
    this.error.set('');
    this.service.getAll(filtres).subscribe({
      next: (data) => { this.campagnes.set(data); this.loading.set(false); },
      error: () => { this.error.set('Impossible de charger les campagnes.'); this.loading.set(false); },
    });
  }

  appliquerFiltres(filtres: FilterValues) {
    this.charger(filtres);
  }

  pourcentage(c: Campagne): number {
    return pourcentageCampagne(c);
  }
}