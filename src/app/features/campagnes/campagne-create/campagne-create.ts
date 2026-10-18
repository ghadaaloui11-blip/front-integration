import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampagneService } from '../../../core/services/campagne.service';

@Component({
  selector: 'app-campagne-create',
  imports: [ReactiveFormsModule],
  templateUrl: './campagne-create.html',
  styleUrl: './campagne-create.css',
})
export class CampagneCreateComponent {
  private fb = inject(FormBuilder);
  private service = inject(CampagneService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);

  form = this.fb.nonNullable.group({
    titre: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    objectif_montant: [0, [Validators.required, Validators.min(1)]],
    date_debut: ['', Validators.required],
    date_fin: ['', Validators.required],
  });

  submit() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    if (v.date_fin < v.date_debut) {
      this.error.set('La date de fin doit être après la date de début.');
      return;
    }
    this.loading.set(true);
    this.service.create(v).subscribe({
      next: () => this.router.navigate(['/mes-campagnes']),
      error: (e) => {
        this.error.set(e.error?.erreur ?? e.error?.message ?? 'Erreur lors de la création.');
        this.loading.set(false);
      },
    });
  }
}