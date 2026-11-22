import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModerationService, ModerationSignalement } from '../../../core/services/moderation.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.css'
})
export class ModerationComponent implements OnInit {
  private service = inject(ModerationService);

  signalements = signal<ModerationSignalement[]>([]);
  total = signal<number>(0);
  statutFiltre = signal<string>('');
  chargement = signal<boolean>(true);
  erreur = signal<string>('');
  succes = signal<string>('');

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set('');
    this.service.lister(this.statutFiltre() || undefined).subscribe({
      next: (res) => {
        this.signalements.set(res.signalements || []);
        this.total.set(res.total || 0);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors du chargement des signalements.');
        this.chargement.set(false);
      }
    });
  }

  filtrerParStatut(statut: string) {
    this.statutFiltre.set(statut);
    this.charger();
  }

  changerStatut(s: ModerationSignalement, nouveauStatut: string) {
    this.service.changerStatut(s.id, nouveauStatut).subscribe({
      next: () => {
        this.succes.set(`Signalement #${s.id} passé à ${nouveauStatut}.`);
        this.charger();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors de la mise à jour.');
      }
    });
  }

  supprimer(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce signalement ?')) return;

    this.service.supprimer(id).subscribe({
      next: () => {
        this.succes.set(`Signalement #${id} supprimé.`);
        this.charger();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors de la suppression.');
      }
    });
  }
}
