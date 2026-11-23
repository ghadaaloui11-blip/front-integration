import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AbuseReportService,
  MotifAbus,
  NouveauSignalementAbuse,
  TYPES_CONTENU_ABUSIF,
  MOTIFS_ABUS,
  TypeContenuAbusif,
} from '../../../core/services/abuse-report.service';

/** US30 : formulaire de signalement d'un contenu abusif. */
@Component({
  selector: 'app-signaler-abuse',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signaler-abuse.html',
  styleUrl: './signaler-abuse.css',
})
export class SignalerAbuseComponent implements OnInit {
  private service = inject(AbuseReportService);
  private route = inject(ActivatedRoute);

  readonly types = TYPES_CONTENU_ABUSIF;
  readonly motifs = MOTIFS_ABUS;

  typeCible: TypeContenuAbusif = 'campagne';
  cibleId: number | null = null;
  motif: MotifAbus = 'contenu_inapproprie';
  description = '';

  envoi = signal(false);
  erreur = signal('');
  succes = signal('');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const type = params.get('type');
    if (this.types.some((t) => t.valeur === type)) {
      this.typeCible = type as TypeContenuAbusif;
    }
    const id = Number(params.get('id'));
    if (Number.isInteger(id) && id > 0) this.cibleId = id;
  }

  soumettre(): void {
    this.erreur.set('');
    this.succes.set('');

    if (!this.cibleId || this.cibleId < 1) {
      this.erreur.set('Indiquez l’identifiant du contenu concerné.');
      return;
    }

    const donnees: NouveauSignalementAbuse = {
      type_cible: this.typeCible,
      cible_id: this.cibleId,
      motif: this.motif,
      ...(this.description.trim() ? { description: this.description.trim() } : {}),
    };

    this.envoi.set(true);
    this.service.signaler(donnees).subscribe({
      next: (reponse) => {
        this.envoi.set(false);
        this.succes.set(`${reponse.message} Référence : #${reponse.signalement.id}.`);
        this.description = '';
      },
      error: (err) => {
        this.envoi.set(false);
        this.erreur.set(err.error?.erreur ?? 'Impossible d’envoyer le signalement.');
      },
    });
  }
}
