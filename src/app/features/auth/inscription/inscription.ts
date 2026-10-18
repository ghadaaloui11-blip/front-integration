import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{8,}$/)]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role: ['citoyen', Validators.required],
      adresse: ['', Validators.required],
      nomAssociation: [''],
      matriculeFiscal: ['']
    });

    this.inscriptionForm.get('role')!.valueChanges.subscribe(() => this.majChampsAssociation());
    this.majChampsAssociation();
  }

  /** Les champs d'association sont obligatoires uniquement pour le rôle association. */
  private majChampsAssociation() {
    const estAssociation = this.inscriptionForm.get('role')?.value === 'association';
    const validators = estAssociation ? [Validators.required] : [];
    for (const nom of ['nomAssociation', 'matriculeFiscal']) {
      const control = this.inscriptionForm.get(nom)!;
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  onRegister() {
    this.errorMessage = '';
    if (this.inscriptionForm.invalid) {
      this.inscriptionForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
      return;
    }

    const payload = this.inscriptionForm.value;

    this.auth.inscrire(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.erreur ?? err.error?.message ?? 'Une erreur est survenue lors de l\'inscription.';
      }
    });
  }
}