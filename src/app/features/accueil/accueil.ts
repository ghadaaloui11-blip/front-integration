import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampagneService, Campagne, pourcentageCampagne } from '../../core/services/campagne.service';
import { EventService, Evenement } from '../../core/services/event.service';
import { SignalementService, Signalement } from '../../core/services/signalement.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class AccueilComponent implements OnInit {
  private campagneService    = inject(CampagneService);
  private eventService       = inject(EventService);
  private signalementService = inject(SignalementService);

  campagnes    = signal<Campagne[]>([]);
  evenements   = signal<Evenement[]>([]);
  signalements = signal<Signalement[]>([]);
  stats        = signal({ campagnes: 0, evenements: 0, signalements: 0, associations: 0 });

  ngOnInit() {
    this.campagneService.getAll().subscribe({
      next: (data) => {
        this.campagnes.set(data.slice(0, 3));
        this.stats.update(s => ({ ...s, campagnes: data.length }));
      },
    });

    this.eventService.getAll().subscribe({
      next: (data) => {
        this.evenements.set(data.slice(0, 3));
        this.stats.update(s => ({ ...s, evenements: data.length }));
      },
    });

    this.signalementService.listerPublic().subscribe({
      next: (data) => {
        this.signalements.set(data.slice(0, 3));
        this.stats.update(s => ({ ...s, signalements: data.length }));
      },
    });

    this.campagneService.getAssociations().subscribe({
      next: (data) => this.stats.update(s => ({ ...s, associations: data.length })),
    });
  }

  pourcentage(c: Campagne): number {
    return pourcentageCampagne(c);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  labelStatut(statut?: string): string {
    switch (statut) {
      case 'en_cours': return 'En cours';
      case 'resolu':   return 'Résolu';
      default:         return 'Reçu';
    }
  }

  classeStatut(statut?: string): string {
    switch (statut) {
      case 'en_cours': return 'badge-encours';
      case 'resolu':   return 'badge-resolu';
      default:         return 'badge-recu';
    }
  }
}
