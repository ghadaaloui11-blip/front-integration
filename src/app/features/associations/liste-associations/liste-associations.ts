import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AssociationPubliqueService,
  AssociationPublique,
} from '../../../core/services/association-publique.service';

@Component({
  selector: 'app-liste-associations',
  standalone: true,
  imports: [CommonModule, FormsModule],
    templateUrl: './liste-associations.html',
    styleUrls: ['./liste-associations.css'],
})
export class ListeAssociationsComponent implements OnInit {
  private service = inject(AssociationPubliqueService);

  associations = signal<AssociationPublique[]>([]);
  loading = signal(true);
  error = signal('');

  recherche = '';

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set('');

    this.service.lister(this.recherche.trim()).subscribe({
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

  reinitialiser() {
    this.recherche = '';
    this.charger();
  }
}