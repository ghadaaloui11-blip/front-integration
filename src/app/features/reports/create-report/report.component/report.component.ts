import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalementService } from '../../../../core/services/signalement.service';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html'})
export class CreateReportComponent {
  description = '';
  latitude = '';
  longitude = '';
  estAnonyme = false;
  selectedFile: File | null = null;
  message = '';
  erreur = '';
  envoi = false;

  constructor(private signalementService: SignalementService) {}

  // Récupérer la géolocalisation GPS du navigateur
  obtenirGPS() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude.toString();
          this.longitude = position.coords.longitude.toString();
        },
        () => {
          this.erreur = 'Impossible de récupérer la géolocalisation.';
        }
      );
    } else {
      this.erreur = "La géolocalisation n'est pas supportée par votre navigateur.";
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.envoi) return;
    this.message = '';
    this.erreur = '';
    if (!this.description.trim()) {
      this.erreur = 'La description est obligatoire.';
      return;
    }

    const formData = new FormData();
    formData.append('description', this.description.trim());
    if (this.latitude) formData.append('latitude', this.latitude);
    if (this.longitude) formData.append('longitude', this.longitude);
    formData.append('est_anonyme', String(this.estAnonyme));
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.envoi = true;
    this.signalementService.creerSignalement(formData).subscribe({
      next: () => {
        this.message = 'Signalement créé avec succès !';
        this.erreur = '';
        this.reset();
        this.envoi = false;
      },
      error: (err) => {
        this.erreur = err.error?.erreur ?? err.error?.message ?? "Erreur lors de l'envoi.";
        this.message = '';
        this.envoi = false;
      }
    });
  }

  private reset() {
    this.description = '';
    this.latitude = '';
    this.longitude = '';
    this.estAnonyme = false;
    this.selectedFile = null;
  }
}
