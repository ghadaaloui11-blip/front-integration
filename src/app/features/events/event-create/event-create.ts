import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './event-create.html',
  styleUrl: './event-create.css',
})
export class EventCreateComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);

  error = signal('');
  loading = signal(false);

  categories = [
    'Distribution alimentaire',
    'Maraude solidaire',
    'Collecte de dons',
    'Aide aux devoirs',
    'Nettoyage écologique',
    'Visite aux personnes isolées',
    'Autre',
  ];

  form = this.fb.nonNullable.group({
    titre: ['', [Validators.required, Validators.minLength(3)]],
    categorie: ['Distribution alimentaire', Validators.required],
    date_evenement: ['', Validators.required],
    ville: ['', Validators.required],
    lieu: ['', Validators.required],
    places_disponibles: [10, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    const val = this.form.getRawValue();
    const eventDate = new Date(val.date_evenement);
    if (eventDate.getTime() <= Date.now()) {
      this.error.set('La date de l\'événement doit être dans le futur.');
      return;
    }

    this.loading.set(true);
    this.eventService.create(val).subscribe({
      next: (event) => {
        this.loading.set(false);
        this.router.navigate(['/mes-evenements']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.erreur || 'Erreur lors de la création de l\'événement.');
      },
    });
  }
}
