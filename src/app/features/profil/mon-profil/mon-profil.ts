import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilService } from '../../../core/services/profil.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mon-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mon-profil.html',
  styleUrl: './mon-profil.css',
})
export class MonProfilComponent implements OnInit {
  private profilService = inject(ProfilService);
  private auth = inject(AuthService);

  loading = signal(true);
  envoi = signal(false);
  enEdition = signal(false);
  error = signal('');
  success = signal('');

  role = '';
  nom = '';
  prenom = '';
  email = '';
  telephone = '';

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.profilService.getProfil().subscribe({
      next: (p) => {
        this.role = p.role;
        this.nom = p.nom;
        this.prenom = p.prenom || '';
        this.email = p.email;
        this.telephone = p.telephone || '';
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger votre profil.');
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

    if (this.nom.trim().length < 2) {
      this.error.set('Le nom est obligatoire (2 caractères minimum).');
      return;
    }
    if (this.prenom.trim().length < 2) {
      this.error.set('Le prénom est obligatoire (2 caractères minimum).');
      return;
    }
    if (this.telephone.trim().length < 8) {
      this.error.set('Le téléphone est obligatoire (8 caractères minimum).');
      return;
    }

    this.envoi.set(true);
    this.profilService
      .modifier({
        nom: this.nom.trim(),
        prenom: this.prenom.trim(),
        email: this.email.trim(),
        telephone: this.telephone.trim(),
      })
      .subscribe({
        next: (res) => {
          this.auth.sauvegarderToken(res.token);
          this.nom = res.utilisateur.nom;
          this.prenom = res.utilisateur.prenom || '';
          this.email = res.utilisateur.email;
          this.telephone = res.utilisateur.telephone || '';
          this.success.set('Profil mis à jour avec succès.');
          this.envoi.set(false);
          this.enEdition.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.erreur ?? 'Erreur lors de la mise à jour du profil.');
          this.envoi.set(false);
        },
      });
  }

  labelRole(): string {
    if (this.role === 'association') return 'Association';
    if (this.role === 'admin') return 'Administrateur';
    return 'Citoyen';
  }
}