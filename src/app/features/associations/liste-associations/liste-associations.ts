import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AssociationPubliqueService,
  AssociationPublique,
} from '../../../core/services/association-publique.service';
import {
  FilterBarComponent,
  FilterValues,
} from '../../../core/components/filter-bar/filter-bar.component';
import { CATEGORIES_ASSOCIATION } from '../../../core/constants/categories';

@Component({
  selector: 'app-liste-associations',
  standalone: true,
  imports: [CommonModule, FilterBarComponent],
  templateUrl: './liste-associations.html',
  styleUrls: ['./liste-associations.css'],
})
export class ListeAssociationsComponent implements OnInit {
  private service = inject(AssociationPubliqueService);

  associations = signal<AssociationPublique[]>([]);
  loading = signal(true);
  error = signal('');

  /** US38 : pas de filtre de date sur les associations. */
  readonly categories = CATEGORIES_ASSOCIATION;

  ngOnInit() {
    this.charger();
  }

  charger(filtres?: Partial<FilterValues>) {
    this.loading.set(true);
    this.error.set('');

    this.service.lister(filtres).subscribe({
      next: (data) => {
        this.associations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des associations.');
        this.loading.set(false);
      },
    });
  }

  appliquerFiltres(filtres: FilterValues) {
    this.charger(filtres);
  }
}