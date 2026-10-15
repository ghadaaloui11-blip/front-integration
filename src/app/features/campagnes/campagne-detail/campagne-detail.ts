import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Avancement, CampagneService } from '../../../core/services/campagne.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-campagne-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './campagne-detail.html',
  styleUrl: './campagne-detail.css',
})
export class CampagneDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CampagneService);
  private auth = inject(AuthService);

  data = signal<Avancement | null>(null);
  error = signal('');
  success = signal('');

  isAssociation = this.auth.getRole() === 'association';

  libelle = '';
  montant: number | null = null;

  get campagneId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() { this.load(); }

  load() {
    this.service.getAvancement(this.campagneId).subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.error?.message ?? 'Campagne introuvable.'),
    });
  }

  ajouterUtilisation() {
    this.error.set('');
    this.success.set('');
    if (!this.libelle || !this.montant) {
      this.error.set('Libellé et montant obligatoires.');
      return;
    }
    this.service.addUtilisation(this.campagneId, { libelle: this.libelle, montant: this.montant }).subscribe({
      next: () => {
        this.success.set('Utilisation enregistrée.');
        this.libelle = '';
        this.montant = null;
        this.load();
      },
      error: (e) => this.error.set(e.error?.message ?? 'Erreur lors de l\'enregistrement.'),
    });
  }
}