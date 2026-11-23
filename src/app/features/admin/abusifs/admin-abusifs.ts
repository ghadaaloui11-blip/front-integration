import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AbuseReportService,
  MOTIFS_ABUS,
  SignalementAbuse,
  TYPES_CONTENU_ABUSIF,
} from '../../../core/services/abuse-report.service';

/** US31 / US32 : file d'examen et suppression des contenus abusifs (admin). */
@Component({
  selector: 'app-admin-abusifs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-abusifs.html',
  styleUrl: './admin-abusifs.css',
})
export class AdminAbusifsComponent implements OnInit {
  private service = inject(AbuseReportService);

  readonly types = TYPES_CONTENU_ABUSIF;
  readonly motifs = MOTIFS_ABUS;
  readonly statuts = [
    { valeur: '', label: 'Tous' },
    { valeur: 'recu', label: 'Reçus' },
    { valeur: 'en_cours', label: 'En cours' },
    { valeur: 'resolu', label: 'Résolus' },
    { valeur: 'rejete', label: 'Classés sans suite' },
  ];

  signalements = signal<SignalementAbuse[]>([]);
  total = signal(0);
  statutFiltre = '';
  typeFiltre = '';
  chargement = signal(true);
  erreur = signal('');
  succes = signal('');
  decisions: Record<number, string> = {};

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set('');
    this.service
      .listerAdministration({ statut: this.statutFiltre || undefined, type: this.typeFiltre || undefined })
      .subscribe({
        next: (res) => {
          this.signalements.set(res.signalements ?? []);
          this.total.set(res.total ?? 0);
          this.chargement.set(false);
        },
        error: (err) => {
          this.erreur.set(err.error?.erreur ?? 'Impossible de charger la file de modération.');
          this.chargement.set(false);
        },
      });
  }

  appliquerFiltres(): void {
    this.charger();
  }

  changerStatut(s: SignalementAbuse, statut: string): void {
    if (!statut) return;
    this.service.changerStatut(s.id, statut, this.decisions[s.id]?.trim() || undefined).subscribe({
      next: () => {
        this.succes.set(`Signalement #${s.id} : décision enregistrée.`);
        this.charger();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur ?? 'Impossible d’enregistrer la décision.');
      },
    });
  }

  supprimerContenu(s: SignalementAbuse): void {
    const confirmation = confirm(
      `Supprimer définitivement le contenu « ${s.titre_cible || `#${s.cible_id}`} » ?\nCette action est irréversible.`
    );
    if (!confirmation) return;

    this.service.supprimerContenu(s.id).subscribe({
      next: () => {
        this.succes.set(`Contenu du signalement #${s.id} supprimé.`);
        this.charger();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur ?? 'Impossible de supprimer le contenu.');
      },
    });
  }

  lienCible(s: SignalementAbuse): string[] {
    switch (s.type_cible) {
      case 'campagne':
        return ['/campagnes', String(s.cible_id)];
      case 'evenement':
        return ['/evenements', String(s.cible_id)];
      case 'association':
        return ['/associations'];
      default:
        return ['/signalements-publics'];
    }
  }

  libelleType = (t: string) => this.service.libelleType(t);
  libelleMotif = (m: string) => this.service.libelleMotif(m);
  libelleStatut = (s: string) => this.service.libelleStatut(s);

  formaterDate(date?: string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR');
  }
}
