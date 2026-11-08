import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BenevoleService } from '../../../core/services/benevole.service';

@Component({
  selector: 'app-devenir-benevole',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devenir-benevole.html',
  styleUrl: './devenir-benevole.css',
})
export class DevenirBenevoleComponent implements OnInit {
  private service = inject(BenevoleService);

  loading = signal(true);
  envoi = signal(false);
  dejaInscrit = signal(false);
  enEdition = signal(false);
  error = signal('');
  success = signal('');

  disponibilitesListe = ['Week-end', 'Soirées', 'Jours de semaine', 'Tous les jours', 'Flexible'];

  competences = '';
  disponibilites = 'Week-end';
  ville = '';
  motivation = '';

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.service.getMonProfil().subscribe({
      next: (b) => {
        this.competences = b.competences;
        this.disponibilites = b.disponibilites;
        this.ville = b.ville;
        this.motivation = b.motivation || '';
        this.dejaInscrit.set(true);
        this.enEdition.set(false);
        this.loading.set(false);
      },
      error: (e) => {
        if (e.status === 404) {
          // Pas encore bénévole : on affiche le formulaire d'inscription
          this.dejaInscrit.set(false);
          this.enEdition.set(true);
        } else {
          this.error.set('Impossible de charger votre profil bénévole.');
        }
        this.loading.set(false);
      },
    });
  }

  modifier() {
    this.error.set('');
    this.success.set('');
    this.enEdition.set(true);
  }

  annuler() {
    this.error.set('');
    this.enEdition.set(false);
    this.charger();
  }

  enregistrer() {
    this.error.set('');
    this.success.set('');

    if (this.competences.trim().length < 3) {
      this.error.set('Indiquez vos compétences (3 caractères minimum).');
      return;
    }
    if (this.ville.trim().length < 2) {
      this.error.set('La ville est obligatoire.');
      return;
    }

    const data = {
      competences: this.competences.trim(),
      disponibilites: this.disponibilites,
      ville: this.ville.trim(),
      motivation: this.motivation.trim(),
    };

    this.envoi.set(true);

    if (this.dejaInscrit()) {
      this.service.modifier(data).subscribe({
        next: () => {
          this.success.set('Profil bénévole mis à jour.');
          this.envoi.set(false);
          this.enEdition.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.erreur ?? 'Erreur lors de la mise à jour.');
          this.envoi.set(false);
        },
      });
    } else {
      this.service.inscrire(data).subscribe({
        next: () => {
          this.success.set('Merci ! Vous êtes maintenant inscrit comme bénévole.');
          this.dejaInscrit.set(true);
          this.envoi.set(false);
          this.enEdition.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.erreur ?? "Erreur lors de l'inscription.");
          this.envoi.set(false);
        },
      });
    }
  }
}