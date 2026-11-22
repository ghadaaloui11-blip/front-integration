import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DefiService, ParticipationDefi } from '../../../core/services/defi.service';

/** US26 : mes participations aux defis. */
@Component({
  selector: 'app-mes-defis',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mes-defis.html',
  styleUrl: './mes-defis.css',
})
export class MesDefisComponent implements OnInit {
  private service = inject(DefiService);

  participations = signal<ParticipationDefi[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.mesParticipations().subscribe({
      next: (data) => { this.participations.set(data); this.loading.set(false); },
      error: () => { this.error.set('Impossible de charger vos défis.'); this.loading.set(false); },
    });
  }

  libelleStatut(statut: string): string {
    const libelles: Record<string, string> = {
      en_cours: 'En cours',
      en_attente: 'En attente de validation',
      complete: 'Terminé 🎉',
      rejete: 'Preuve refusée',
    };
    return libelles[statut] || statut;
  }
}
