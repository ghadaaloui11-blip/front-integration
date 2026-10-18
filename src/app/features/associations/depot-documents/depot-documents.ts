import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AssociationService,
  DocumentAssociation,
  StatutValidation,
} from '../../../core/services/association.service';

@Component({
  selector: 'app-depot-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depot-documents.html',
  styleUrl: './depot-documents.css',
})
export class DepotDocuments implements OnInit {
  private service = inject(AssociationService);

  // State
  documents = signal<DocumentAssociation[]>([]);
  statut = signal<StatutValidation | null>(null);
  loading = signal(false);
  uploading = signal(false);
  error = signal('');
  success = signal('');

  // Formulaire upload
  typeDocument = 'statuts';
  fichierSelectionne: File | null = null;

  typesDocument = [
    { value: 'statuts', label: 'Statuts de l\'association' },
    { value: 'matricule_fiscal', label: 'Matricule fiscal' },
    { value: 'registre_commerce', label: 'Registre du commerce' },
    { value: 'autre', label: 'Autre document' },
  ];

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    this.loading.set(true);
    this.service.getMonStatut().subscribe({
      next: (s) => this.statut.set(s),
      error: () => {},
    });
    this.service.getMesDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onFichierChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fichierSelectionne = input.files?.[0] ?? null;
  }

  deposer() {
    this.error.set('');
    this.success.set('');

    if (!this.fichierSelectionne) {
      this.error.set('Veuillez sélectionner un fichier.');
      return;
    }

    this.uploading.set(true);
    this.service.deposerDocument(this.typeDocument, this.fichierSelectionne).subscribe({
      next: () => {
        this.success.set('Document déposé avec succès.');
        this.fichierSelectionne = null;
        // reset input file
        const input = document.getElementById('fichier') as HTMLInputElement;
        if (input) input.value = '';
        this.chargerDonnees();
        this.uploading.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.message ?? 'Erreur lors du dépôt.');
        this.uploading.set(false);
      },
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer ce document ?')) return;
    this.service.supprimerDocument(id).subscribe({
      next: () => {
        this.documents.update((docs) => docs.filter((d) => d.id !== id));
        this.success.set('Document supprimé.');
      },
      error: () => this.error.set('Erreur lors de la suppression.'),
    });
  }

  getStatutLabel(s: string): string {
    const map: Record<string, string> = {
      pending: 'En attente de validation',
      approuve: 'Approuvée',
      refuse: 'Refusée',
    };
    return map[s] ?? s;
  }

  getTypeLabel(value: string): string {
    return this.typesDocument.find((t) => t.value === value)?.label ?? value;
  }
}
