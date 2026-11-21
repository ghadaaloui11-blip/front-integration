import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminApiService,
  LigneStatut,
  StatsAdmin,
  UtilisateurAdmin,
} from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(AdminApiService);

  stats: StatsAdmin | null = null;
  blocs: Array<{ titre: string; icone: string; lignes: LigneStatut[] }> = [];
  utilisateurs: UtilisateurAdmin[] = [];
  recherche = '';
  page = 1;
  erreur = '';
  chargement = false;
  enCours: number | null = null; // id de l'utilisateur dont le statut est en cours de changement
  dateDuJour = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  ngOnInit() {
    this.actualiser();
  }

  actualiser() {
    this.erreur = '';
    this.chargerStats();
    this.chargerUtilisateurs();
  }

  chargerStats() {
    this.chargement = true;
    this.api.stats().subscribe({
      next: (data) => {
        this.stats = data;
        this.blocs = [
          { titre: 'Signalements', icone: '📢', lignes: data.signalements },
          { titre: "Demandes d'aide", icone: '🤝', lignes: data.demandesAide },
          { titre: 'Dons en nature', icone: '🎁', lignes: data.donsNature },
        ];
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Impossible de charger les statistiques.';
        this.chargement = false;
      },
    });
  }

  chargerUtilisateurs() {
    this.api.utilisateurs(this.recherche, this.page).subscribe({
      next: (data) => {
        this.utilisateurs = data;
      },
      error: () => {
        this.erreur = 'Impossible de charger les utilisateurs.';
      },
    });
  }

  rechercher() {
    this.page = 1;
    this.chargerUtilisateurs();
  }

  pagePrecedente() {
    if (this.page > 1) {
      this.page = this.page - 1;
      this.chargerUtilisateurs();
    }
  }

  pageSuivante() {
    if (this.utilisateurs.length === 10) {
      this.page = this.page + 1;
      this.chargerUtilisateurs();
    }
  }

  // ---------- Désactiver / réactiver un compte ----------

  basculerStatut(u: UtilisateurAdmin) {
    const nouveau = u.actif === false; // si désactivé -> on réactive
    const action = nouveau ? 'Réactiver' : 'Désactiver';
    if (!confirm(action + ' le compte de ' + u.prenom + ' ' + u.nom + ' ?')) {
      return;
    }

    this.enCours = u.id;
    this.erreur = '';
    this.api.changerStatutUtilisateur(u.id, nouveau).subscribe({
      next: () => {
        u.actif = nouveau;
        this.enCours = null;
      },
      error: (err) => {
        this.erreur =
          (err.error && err.error.erreur) || 'Impossible de modifier le statut du compte.';
        this.enCours = null;
      },
    });
  }

  // ---------- Aides pour l'affichage ----------

  total(lignes: LigneStatut[]): number {
    let somme = 0;
    for (let i = 0; i < lignes.length; i++) {
      somme = somme + lignes[i].total;
    }
    return somme;
  }

  pourcentage(valeur: number, lignes: LigneStatut[]): number {
    const t = this.total(lignes);
    if (t === 0) {
      return 0;
    }
    return Math.round((valeur * 100) / t);
  }

  libelle(statut: string): string {
    const noms: { [cle: string]: string } = {
      recu: 'Reçu',
      recue: 'Reçue',
      en_cours: 'En cours',
      resolu: 'Résolu',
      traite: 'Traité',
      acceptee: 'Acceptée',
      refusee: 'Refusée',
      propose: 'Proposé',
      accepte: 'Accepté',
      collecte: 'Collecté',
      refuse: 'Refusé',
      annule: 'Annulé',
    };
    if (noms[statut]) {
      return noms[statut];
    }
    return statut.replace('_', ' ');
  }

  couleur(statut: string): string {
    if (
      statut === 'acceptee' ||
      statut === 'accepte' ||
      statut === 'collecte' ||
      statut === 'resolu' ||
      statut === 'traite'
    ) {
      return 'vert';
    }
    if (statut === 'refusee' || statut === 'refuse' || statut === 'annule') {
      return 'rouge';
    }
    if (statut === 'en_cours' || statut === 'propose') {
      return 'bleu';
    }
    return 'orange';
  }

  couleurRole(role: string): string {
    if (role === 'admin') {
      return '#ef4444';
    }
    if (role === 'association') {
      return '#3b82f6';
    }
    return '#10b981';
  }

  // Donut : construit le dégradé conique à partir des rôles
  donut(): string {
    if (!this.stats || this.stats.utilisateurs.total === 0) {
      return '#e5e7eb';
    }
    const roles = this.stats.utilisateurs.parRole;
    const totalUsers = this.stats.utilisateurs.total;
    let debut = 0;
    let morceaux = '';
    for (let i = 0; i < roles.length; i++) {
      const part = (roles[i].total * 100) / totalUsers;
      const fin = debut + part;
      if (morceaux !== '') {
        morceaux = morceaux + ', ';
      }
      morceaux =
        morceaux + this.couleurRole(roles[i].role) + ' ' + debut + '% ' + fin + '%';
      debut = fin;
    }
    return 'conic-gradient(' + morceaux + ')';
  }

  initiales(u: UtilisateurAdmin): string {
    const p = (u.prenom || '').charAt(0);
    const n = (u.nom || '').charAt(0);
    return (p + n).toUpperCase();
  }
}