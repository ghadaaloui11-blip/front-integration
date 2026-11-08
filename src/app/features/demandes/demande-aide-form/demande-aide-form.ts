import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeAideService } from '../../../core/services/demande-aide.service';
import {
  AssociationPubliqueService,
  AssociationPublique,
} from '../../../core/services/association-publique.service';

@Component({
  selector: 'app-demande-aide-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
    templateUrl: './demande-aide-form.html',
    styleUrls: ['./demande-aide-form.css'],
})
export class DemandeAideFormComponent implements OnInit {
  private demandeService = inject(DemandeAideService);
  private associationService = inject(AssociationPubliqueService);

  associations = signal<AssociationPublique[]>([]);
  envoi = signal(false);
  error = signal('');
  success = signal('');

  categories = [
    { value: 'alimentaire', label: 'Aide alimentaire' },
    { value: 'scolaire', label: 'Aide scolaire' },
    { value: 'medicale', label: 'Aide médicale' },
    { value: 'logement', label: 'Logement' },
    { value: 'vestimentaire', label: 'Vêtements' },
    { value: 'autre', label: 'Autre' },
  ];

  categorie = 'alimentaire';
  description = '';
  ville = '';
  telephone = '';
  associationId: number | null = null;

  ngOnInit() {
    this.associationService.lister().subscribe({
      next: (data) => this.associations.set(data),
      error: () => this.associations.set([]),
    });
  }

  envoyer() {
    this.error.set('');
    this.success.set('');

    if (this.description.trim().length < 10) {
      this.error.set('La description doit contenir au moins 10 caractères.');
      return;
    }
    if (this.ville.trim().length < 2) {
      this.error.set('La ville est obligatoire.');
      return;
    }

    this.envoi.set(true);
    this.demandeService
      .envoyer({
        categorie: this.categorie,
        description: this.description.trim(),
        ville: this.ville.trim(),
        telephone: this.telephone.trim(),
        associationId: this.associationId,
      })
      .subscribe({
        next: () => {
          this.success.set('Votre demande a bien été envoyée. Une association vous contactera.');
          this.description = '';
          this.ville = '';
          this.telephone = '';
          this.associationId = null;
          this.envoi.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.erreur ?? 'Erreur lors de l\'envoi de la demande.');
          this.envoi.set(false);
        },
      });
  }
}