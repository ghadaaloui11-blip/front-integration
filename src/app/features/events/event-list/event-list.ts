import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService, Evenement, FiltresEvenement } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  protected auth = inject(AuthService);

  evenements = signal<Evenement[]>([]);
  loading = signal(true);
  error = signal('');

  categories = [
    'Toutes',
    'Distribution alimentaire',
    'Maraude solidaire',
    'Collecte de dons',
    'Aide aux devoirs',
    'Nettoyage écologique',
    'Visite aux personnes isolées',
    'Autre',
  ];

  filtres: FiltresEvenement = {
    search: '',
    ville: '',
    categorie: 'Toutes',
    date: '',
  };

  ngOnInit() {
    this.chargerEvenements();
  }

  chargerEvenements() {
    this.loading.set(true);
    this.error.set('');

    this.eventService.getAll(this.filtres).subscribe({
      next: (data) => {
        this.evenements.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Impossible de charger les événements.');
        this.loading.set(false);
      },
    });
  }

  reinitialiserFiltres() {
    this.filtres = {
      search: '',
      ville: '',
      categorie: 'Toutes',
      date: '',
    };
    this.chargerEvenements();
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }
}
