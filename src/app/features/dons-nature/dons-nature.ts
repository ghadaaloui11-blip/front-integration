import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DonsNatureService, DonNature,
  TYPES_DON, labelStatutDon, classeStatutDon,
} from '../../core/services/dons-nature.service';

@Component({
  selector: 'app-dons-nature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dons-nature.html',
  styleUrl: './dons-nature.css',
})
export class DonsNatureComponent implements OnInit {
  private service = inject(DonsNatureService);

  dons       = signal<DonNature[]>([]);
  loading    = signal(true);
  envoi      = signal(false);
  showForm   = signal(false);
  error      = signal('');
  success    = signal('');
  errorForm  = signal('');

  typesDon = TYPES_DON;

  // Champs formulaire
  type_don    = 'Vêtements';
  description = '';
  quantite    = '';
  ville       = '';

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.service.mesDons().subscribe({
      next: (data) => { this.dons.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); },
    });
  }

  ouvrirFormulaire() {
    this.errorForm.set('');
    this.success.set('');
    this.reinitForm();
    this.showForm.set(true);
  }

  fermerFormulaire() {
    this.showForm.set(false);
    this.errorForm.set('');
  }

  private reinitForm() {
    this.type_don    = 'Vêtements';
    this.description = '';
    this.quantite    = '';
    this.ville       = '';
  }

  soumettre() {
    this.errorForm.set('');
    if (!this.description.trim() || this.description.trim().length < 10) {
      this.errorForm.set('La description doit contenir au moins 10 caractères.');
      return;
    }
    if (!this.ville.trim()) {
      this.errorForm.set('La ville est obligatoire.');
      return;
    }

    this.envoi.set(true);
    this.service.proposer({
      type_don:    this.type_don,
      description: this.description.trim(),
      quantite:    this.quantite.trim() || undefined,
      ville:       this.ville.trim(),
    }).subscribe({
      next: () => {
        this.success.set('Votre don a été proposé avec succès ! Une association vous contactera.');
        this.showForm.set(false);
        this.reinitForm();
        this.envoi.set(false);
        this.charger();
      },
      error: (e) => {
        this.errorForm.set(e.error?.erreur ?? 'Erreur lors de la proposition.');
        this.envoi.set(false);
      },
    });
  }

  annuler(id: number) {
    if (!confirm('Annuler ce don ?')) return;
    this.error.set('');
    this.service.annuler(id).subscribe({
      next: () => {
        this.success.set('Don annulé.');
        this.charger();
      },
      error: (e) => this.error.set(e.error?.erreur ?? "Erreur lors de l'annulation."),
    });
  }

  labelStatut(s: string)  { return labelStatutDon(s); }
  classeStatut(s: string) { return classeStatutDon(s); }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
