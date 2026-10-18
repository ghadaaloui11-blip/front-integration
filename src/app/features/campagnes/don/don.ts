import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avancement, CampagneService } from '../../../core/services/campagne.service';
import { AuthService } from '../../../core/services/auth.service';
import { Don, DonService } from '../../../core/services/don.service';

@Component({
  selector: 'app-don',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './don.html',
  styleUrl: './don.css',
})
export class DonComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private campagneService = inject(CampagneService);
  private donService = inject(DonService);
  private auth = inject(AuthService);

  campagne = signal<Avancement | null>(null);
  receipt = signal<Don | null>(null);
  error = signal('');
  loading = signal(false);

  presets = [10, 25, 50, 100];
  donateur = this.auth.getNom();

  form = this.fb.nonNullable.group({
    montant: [0, [Validators.required, Validators.min(1)]],
    nom: [this.donateur ?? ''],
    message: [''],
    estAnonyme: [false],
  });

  get campagneId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    const id = this.campagneId;
    if (!Number.isFinite(id)) {
      this.error.set('Campagne introuvable.');
      return;
    }
    this.campagneService.getAvancement(id).subscribe({
      next: (d) => this.campagne.set(d),
      error: (e) => this.error.set(e.error?.erreur ?? 'Campagne introuvable.'),
    });
  }

  setMontant(montant: number) {
    this.form.controls.montant.setValue(montant);
  }

  submit() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const estAnonyme = v.estAnonyme;
    this.loading.set(true);
    this.donService
      .creerDon(this.campagneId, {
        montant: v.montant,
        est_anonyme: estAnonyme,
        nom: estAnonyme ? undefined : v.nom?.trim() || undefined,
        message: v.message?.trim() || undefined,
      })
      .subscribe({
        next: (don) => {
          this.receipt.set(don);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(e.error?.erreur ?? 'Erreur lors du don.');
          this.loading.set(false);
        },
      });
  }

  imprimer() {
    window.print();
  }
}
