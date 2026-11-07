import { Component, OnInit, inject, signal } from '@angular/core';
import { API_BASE } from '../../../core/config/api-base.token';
import {
  Signalement,
  SignalementService,
  classeStatut,
  labelStatut,
} from '../../../core/services/signalement.service';

/**
 * US07 / US32 / US33 : espace association.
 *  - Onglet « Disponibles » : tous les signalements publiés, avec la
 *    possibilité de prendre explicitement en charge un signalement « Reçu ».
 *  - Onglet « Mes prises en charge » : signalements dont l'association est
 *    responsable, avec mise à jour du statut (en_cours -> resolu).
 * Aucune affectation automatique : seule une action explicite de
 * l'association crée la responsabilité.
 */
@Component({
  selector: 'app-association-reports',
  imports: [],
  templateUrl: './association-reports.html',
  styleUrl: './association-reports.css',
})
export class AssociationReportsComponent implements OnInit {
  private signalements = inject(SignalementService);
  private apiBase = inject(API_BASE);

  onglet = signal<'disponibles' | 'mes'>('disponibles');

  disponibles = signal<Signalement[]>([]);
  prisesEnCharge = signal<Signalement[]>([]);

  chargementDisponibles = signal(true);
  chargementMes = signal(true);
  error = signal('');

  // Retour utilisateur après une action (US32/US33)
  message = signal('');
  erreurAction = signal('');
  actionEnCours = signal<number | null>(null);

  selected: Signalement | null = null;

  // Exposés pour le template
  labelStatut = labelStatut;
  classeStatut = classeStatut;

  ngOnInit() {
    this.recharger();
  }

  recharger() {
    this.error.set('');
    this.chargementDisponibles.set(true);
    this.chargementMes.set(true);
    this.selected = null;

    this.signalements.listerPublic().subscribe({
      next: (data) => {
        this.disponibles.set(data);
        this.chargementDisponibles.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.erreur ?? e.error?.message ?? 'Impossible de charger les signalements.');
        this.chargementDisponibles.set(false);
      },
    });

    this.signalements.listerPrisesEnCharge().subscribe({
      next: (data) => {
        this.prisesEnCharge.set(data);
        this.chargementMes.set(false);
      },
      error: () => {
        // Un chargement vide reste acceptable ; l'onglet affichera l'état vide.
        this.prisesEnCharge.set([]);
        this.chargementMes.set(false);
      },
    });
  }

  definirOnglet(onglet: 'disponibles' | 'mes') {
    this.onglet.set(onglet);
  }

  /** US32 : prise en charge explicite d'un signalement disponible. */
  prendreEnCharge(s: Signalement) {
    if (this.actionEnCours() !== null) return;
    this.actionEnCours.set(s.id);
    this.message.set('');
    this.erreurAction.set('');

    this.signalements.prendreEnCharge(s.id).subscribe({
      next: (reponse) => {
        this.message.set(`Signalement #${s.id} pris en charge — statut passé à « ${labelStatut(reponse.signalement.statut)} ».`);
        this.actionEnCours.set(null);
        this.recharger();
      },
      error: (e) => {
        this.erreurAction.set(
          e.error?.erreur ?? 'Impossible de prendre en charge ce signalement.'
        );
        this.actionEnCours.set(null);
        // Un concurrent a pu revendiquer le signalement entre-temps : on rafraîchit.
        this.recharger();
      },
    });
  }

  /** US33 : l'association responsable résout son signalement. */
  resoudre(s: Signalement) {
    if (this.actionEnCours() !== null) return;
    this.actionEnCours.set(s.id);
    this.message.set('');
    this.erreurAction.set('');

    this.signalements.changerStatut(s.id, 'resolu').subscribe({
      next: () => {
        this.message.set(`Signalement #${s.id} marqué comme résolu. Les citoyens voient le nouveau statut.`);
        this.actionEnCours.set(null);
        this.recharger();
      },
      error: (e) => {
        this.erreurAction.set(
          e.error?.erreur ?? 'Impossible de mettre à jour le statut du signalement.'
        );
        this.actionEnCours.set(null);
        this.recharger();
      },
    });
  }

  /** US33 : réouverture d'un signalement résolu (la situation n'est pas réglée). */
  rouvrir(s: Signalement) {
    if (this.actionEnCours() !== null) return;
    this.actionEnCours.set(s.id);
    this.message.set('');
    this.erreurAction.set('');

    this.signalements.changerStatut(s.id, 'en_cours').subscribe({
      next: () => {
        this.message.set(`Signalement #${s.id} rouvert — statut passé à « En cours ».`);
        this.actionEnCours.set(null);
        this.recharger();
      },
      error: (e) => {
        this.erreurAction.set(
          e.error?.erreur ?? 'Impossible de rouvrir ce signalement.'
        );
        this.actionEnCours.set(null);
        this.recharger();
      },
    });
  }

  titreDe(s: Signalement): string {
    return s.titre || s.description || `Signalement #${s.id}`;
  }

  photoUrl(s: Signalement): string | null {
    return s.photo ? `${this.apiBase}/${s.photo}` : null;
  }

  lieuDe(s: Signalement): string {
    if (s.adresse || s.lieu) return s.adresse || s.lieu || '';
    if (s.latitude != null && s.longitude != null) return `${s.latitude}, ${s.longitude}`;
    return '';
  }

  formaterDate(date?: string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR');
  }

  tempsEcoule(date?: string | null): string {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const heures = Math.floor(diff / 3600000);
    if (heures < 1) return "il y a moins d'1 h";
    if (heures < 24) return `il y a ${heures} h`;
    const jours = Math.floor(heures / 24);
    if (jours === 1) return 'hier';
    return `il y a ${jours} j`;
  }
}
