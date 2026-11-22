import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Activite, ActiviteService } from '../../../core/services/activite.service';

/** US37 : historique chronologique et prive des actions de l'utilisateur. */
@Component({
  selector: 'app-mes-activites',
  imports: [DatePipe],
  templateUrl: './mes-activites.html',
  styleUrl: './mes-activites.css',
})
export class MesActivitesComponent implements OnInit {
  private service = inject(ActiviteService);

  activites = signal<Activite[]>([]);
  loading = signal(true);
  error = signal('');
  page = signal(1);
  aPlus = signal(false);

  readonly limit = 20;

  // Exposes pour le template.
  readonly libelleType = (type: string) => this.service.libelleType(type);
  readonly icone = (type: string) => this.service.icone(type);
  readonly estAnonyme = (a: Activite) => this.service.estAnonyme(a);

  ngOnInit() {
    this.charger();
  }

  charger(page = this.page()) {
    this.loading.set(true);
    this.error.set('');
    this.service.listerMes(page, this.limit).subscribe({
      next: (data) => {
        this.activites.set(data);
        this.aPlus.set(data.length === this.limit);
        this.page.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger votre historique d’activités.');
        this.loading.set(false);
      },
    });
  }

  precedente() {
    if (this.page() > 1) this.charger(this.page() - 1);
  }

  suivante() {
    this.charger(this.page() + 1);
  }
}
