import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AssociationService,
  AssociationAdmin,
  DocumentAdmin,
  statutLabel,
} from '../../../core/services/association.service';
import { API_BASE } from '../../../core/config/api-base.token';

@Component({
  selector: 'app-admin-associations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-associations.html',
  styleUrl: './admin-associations.css',
})
export class AdminAssociationsComponent implements OnInit {
  private service = inject(AssociationService);
  private apiBase = inject(API_BASE);

  associations = signal<AssociationAdmin[]>([]);
  loading = signal(true);
  error = signal('');
  success = signal('');

  // Filtre
  filtreStatut = 'all';

  // Modal documents — boolean classique pour éviter les problèmes de détection de changement
  showModal = false;
  selectedAssoc: AssociationAdmin | null = null;
  documents = signal<DocumentAdmin[]>([]);
  loadingDocs = false;

  // Formulaire de validation
  commentaire = '';

  statutOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'approuve', label: 'Approuvées' },
    { value: 'refuse', label: 'Refusées' },
  ];

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set('');
    const statut = this.filtreStatut !== 'all' ? this.filtreStatut : undefined;
    this.service.listerAssociations(statut).subscribe({
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

  ouvrirModal(assoc: AssociationAdmin) {
    this.selectedAssoc = assoc;
    this.commentaire = '';
    this.documents.set([]);
    this.showModal = true;
    this.loadingDocs = true;

    this.service.getDocumentsAssociation(assoc.id).subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.loadingDocs = false;
      },
      error: (e) => {
        this.error.set(e.error?.erreur ?? e.error?.message ?? 'Impossible de charger les documents.');
        this.loadingDocs = false;
      },
    });
  }

  fermerModal() {
    this.showModal = false;
    this.selectedAssoc = null;
  }

  stopProp(event: Event) {
    event.stopPropagation();
  }

  valider(statut: 'approuve' | 'refuse') {
    if (!this.selectedAssoc) return;

    this.error.set('');
    this.success.set('');

    this.service.validerAssociation(this.selectedAssoc.id, statut, this.commentaire || undefined).subscribe({
      next: () => {
        this.success.set(
          `Association ${statut === 'approuve' ? 'validée' : 'refusée'} avec succès.`
        );
        this.fermerModal();
        this.charger();
      },
      error: (e) => {
        this.error.set(e.error?.erreur ?? e.error?.message ?? 'Erreur lors de la validation.');
      },
    });
  }

  getStatutClass(s: string): string {
    const map: Record<string, string> = {
      pending: 'badge-pending',
      approuve: 'badge-approuve',
      refuse: 'badge-refuse',
    };
    return map[s] ?? '';
  }

  getStatutLabel(s: string): string {
    return statutLabel(s);
  }

  getDocUrl(chemin: string): string {
    return `${this.apiBase}/${chemin}`;
  }

  getDocIcon(nom: string): string {
    return nom.toLowerCase().endsWith('.pdf') ? '📄' : '🖼️';
  }
}
