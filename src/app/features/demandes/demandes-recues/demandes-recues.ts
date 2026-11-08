import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeAideService, DemandeAide } from '../../../core/services/demande-aide.service';

@Component({
  selector: 'app-demandes-recues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demandes-recues.html',
  styleUrl: './demandes-recues.css',
})
export class DemandesRecuesComponent implements OnInit {
  private service = inject(DemandeAideService);

  demandes = signal<DemandeAide[]>([]);
  loading = signal(true);
  error = signal('');
  success = signal('');

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set('');

    this.service.lister().subscribe({
      next: (data) => {
        this.demandes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des demandes.');
        this.loading.set(false);
      },
    });
  }

  changer(id: number, statut: 'acceptee' | 'refusee') {
    this.error.set('');
    this.success.set('');

    this.service.changerStatut(id, statut).subscribe({
      next: () => {
        if (statut === 'acceptee') {
          this.success.set('Demande acceptée.');
        } else {
          this.success.set('Demande refusée.');
        }
        this.charger();
      },
      error: (e) => {
        this.error.set(e.error?.erreur ?? 'Erreur lors de la mise à jour.');
      },
    });
  }

  labelStatut(statut: string): string {
    if (statut === 'acceptee') return 'Acceptée';
    if (statut === 'refusee') return 'Refusée';
    return 'Reçue';
  }

  labelCategorie(categorie: string): string {
    if (categorie === 'alimentaire') return 'Aide alimentaire';
    if (categorie === 'scolaire') return 'Aide scolaire';
    if (categorie === 'medicale') return 'Aide médicale';
    if (categorie === 'logement') return 'Logement';
    if (categorie === 'vestimentaire') return 'Vêtements';
    return 'Autre';
  }
}