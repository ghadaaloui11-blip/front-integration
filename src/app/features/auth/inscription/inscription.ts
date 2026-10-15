import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  inscriptionForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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
  }

  onRegister() {
    if (this.inscriptionForm.invalid) {
      this.inscriptionForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
      return;
    }

    const payload = this.inscriptionForm.value;

    this.http.post('http://localhost:5000/api/auth/inscription', payload).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        alert('Inscription réussie ! Vous pouvez vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription', err);
        this.errorMessage = err.error?.erreur || 'Une erreur est survenue lors de l\'inscription.';
      }
    });
  }
}