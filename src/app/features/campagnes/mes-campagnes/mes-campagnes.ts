import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Campagne, CampagneService, pourcentageCampagne } from '../../../core/services/campagne.service';
import { AssociationService, StatutValidation, statutLabel } from '../../../core/services/association.service';

@Component({
  selector: 'app-mes-campagnes',
  imports: [RouterLink],
  templateUrl: './mes-campagnes.html',
  styleUrl: './mes-campagnes.css',
})
export class MesCampagnesComponent implements OnInit {
  private service = inject(CampagneService);
  private associationService = inject(AssociationService);

  campagnes = signal<Campagne[]>([]);
  statut = signal<StatutValidation | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.associationService.getMonStatut().subscribe({
      next: (s) => this.statut.set(s),
      error: () => this.statut.set(null),
    });

    this.service.getMesCampagnes().subscribe({
      next: (d) => { this.campagnes.set(d); this.loading.set(false); },
      error: (e) => {
        this.error.set(e.error?.erreur ?? e.error?.message ?? 'Impossible de charger vos campagnes.');
        this.loading.set(false);
      },
    });
  }

  pourcentage(c: Campagne): number {
    return pourcentageCampagne(c);
  }

  getStatutLabel(s: string): string {
    return statutLabel(s);
  }
}