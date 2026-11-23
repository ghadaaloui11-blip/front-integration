import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Defi, DefiService } from '../../../core/services/defi.service';

@Component({
  selector: 'app-defi-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './defi-create.html',
  styleUrls: ['./defi-create.css', '../../../core/styles/form-base.css'],
})
export class DefiCreateComponent {
  private service = inject(DefiService);
  private router = inject(Router);

  loading = signal(false);
  envoi = signal(false);
  error = signal('');
  success = signal('');

  titre = '';
  description = '';
  categorie = '';
  mode: 'automatique' | 'manuelle' = 'automatique';
  type_activite = '';
  objectif: number | null = null;
  recompense_points = 0;
  icone = '🏆';
  date_debut = '';
  date_fin = '';
  statut: 'actif' | 'archive' = 'actif';

  readonly modes = [
    { value: 'automatique', label: 'Suivi automatique' },
    { value: 'manuelle', label: 'Preuve photo' },
  ];

  readonly statuts = [
    { value: 'actif', label: 'Actif' },
    { value: 'archive', label: 'Archivé' },
  ];

  get typeActiviteRequis(): boolean {
    return this.mode === 'automatique';
  }

  valider(): string | null {
    if (this.titre.trim().length < 3) {
      return 'Le titre est obligatoire (3 caractères minimum).';
    }
    if (!Number.isInteger(this.objectif) || (this.objectif ?? 0) < 1) {
      return "L'objectif doit être un entier positif.";
    }
    if (this.recompense_points < 0 || !Number.isInteger(this.recompense_points)) {
      return 'La récompense doit être un entier positif ou nul.';
    }
    if (this.typeActiviteRequis && !this.type_activite.trim()) {
      return 'Un défi automatique doit préciser le type d’activité suivi.';
    }
    if (!['actif', 'archive'].includes(this.statut)) {
      return 'Statut invalide.';
    }
    return null;
  }

  enregistrer() {
    if (this.envoi()) return;
    const erreur = this.valider();
    if (erreur) {
      this.error.set(erreur);
      return;
    }
    this.envoi.set(true);
    this.error.set('');
    this.success.set('');

    const payload = {
      titre: this.titre.trim(),
      description: this.description.trim() || null,
      categorie: this.categorie.trim() || null,
      mode: this.mode,
      type_activite: this.typeActiviteRequis ? this.type_activite.trim() : null,
      objectif: this.objectif as number,
      recompense_points: this.recompense_points,
      icone: this.icone.trim() || '🏆',
      date_debut: this.date_debut || null,
      date_fin: this.date_fin || null,
      statut: this.statut,
    };

    this.service.creer(payload).subscribe({
      next: (defi) => {
        this.success.set('Défi créé avec succès.');
        this.envoi.set(false);
        if (defi?.id) {
          this.router.navigate(['/defis', defi.id]);
        } else {
          this.router.navigate(['/defis']);
        }
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Erreur lors de la création du défi.');
        this.envoi.set(false);
      },
    });
  }
}