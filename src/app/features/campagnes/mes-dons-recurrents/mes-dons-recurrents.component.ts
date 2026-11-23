import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonsRecurrentsService, DonRecurrent } from '../../../core/services/dons-recurrents.service';
import { CampagneService, Campagne } from '../../../core/services/campagne.service';

@Component({
  selector: 'app-mes-dons-recurrents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-dons-recurrents.component.html',
  styleUrl: './mes-dons-recurrents.component.css'
})
export class MesDonsRecurrentsComponent implements OnInit {
  private service = inject(DonsRecurrentsService);
  private campagneService = inject(CampagneService);

  dons = signal<DonRecurrent[]>([]);
  campagnes = signal<Campagne[]>([]);
  chargement = signal<boolean>(true);
  erreur = signal<string>('');
  succes = signal<string>('');

  // Formulaire de creation
  showForm = signal<boolean>(false);
  campagneIdSelectionnee = signal<number | null>(null);
  montant = signal<number>(10);
  periodicite = signal<'mensuel' | 'trimestriel' | 'annuel'>('mensuel');

  ngOnInit() {
    this.charger();
    this.campagneService.getAll().subscribe({
      next: (data) => this.campagnes.set(data),
      error: () => {}
    });
  }

  charger() {
    this.chargement.set(true);
    this.erreur.set('');
    this.service.getMesDonsRecurrents().subscribe({
      next: (res) => {
        this.dons.set(res || []);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors du chargement des dons récurrents.');
        this.chargement.set(false);
      }
    });
  }

  creerDon() {
    if (!this.campagneIdSelectionnee()) {
      this.erreur.set('Veuillez sélectionner une campagne.');
      return;
    }
    if (this.montant() <= 0) {
      this.erreur.set('Le montant doit être supérieur à 0.');
      return;
    }

    this.service.creer({
      campagne_id: this.campagneIdSelectionnee()!,
      montant: this.montant(),
      periodicite: this.periodicite()
    }).subscribe({
      next: () => {
        this.succes.set('Don récurrent activé avec succès.');
        this.showForm.set(false);
        this.charger();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors de la mise en place du don.');
      }
    });
  }

  annuler(id: number) {
    if (!confirm('Voulez-vous vraiment annuler ce don récurrent ?')) return;

    this.service.annuler(id).subscribe({
      next: () => {
        this.succes.set('Le don récurrent a été annulé.');
        this.charger();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors de l\'annulation.');
      }
    });
  }
}
