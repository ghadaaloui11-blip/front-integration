import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AbuseReportService,
  SignalementAbuse,
} from '../../../core/services/abuse-report.service';

/** Suivi, par le citoyen, des contenus qu'il a signalés (US30). */
@Component({
  selector: 'app-mes-signalisations-abuse',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mes-signalisations-abuse.html',
  styleUrl: './mes-signalisations-abuse.css',
})
export class MesSignalisationsAbuseComponent implements OnInit {
  private service = inject(AbuseReportService);

  signalements = signal<SignalementAbuse[]>([]);
  chargement = signal(true);
  erreur = signal('');

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.service.mesSignalements().subscribe({
      next: (res) => {
        this.signalements.set(res.signalements ?? []);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur ?? 'Impossible de charger vos signalements.');
        this.chargement.set(false);
      },
    });
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
