import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalementService } from '../../../../core/services/signalement.service';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',  
  styleUrls: ['./report.component.css']})
export class CreateReportComponent {
  description = '';
  latitude = '';
  longitude = '';
  estAnonyme = false;
  selectedFile: File | null = null;
  message = '';
  erreur = '';

  constructor(private signalementService: SignalementService) {}

  // Récupérer la géolocalisation GPS du navigateur
  obtenirGPS() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude.toString();
          this.longitude = position.coords.longitude.toString();
        },
        (error) => {
          alert("Impossible de récupérer la géolocalisation.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('description', this.description);
    if (this.latitude) formData.append('latitude', this.latitude);
    if (this.longitude) formData.append('longitude', this.longitude);
    formData.append('est_anonyme', String(this.estAnonyme));
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.signalementService.creerSignalement(formData).subscribe({
      next: (res: any) => {
        this.message = 'Signalement créé avec succès !';
        this.erreur = '';
      },
      error: (err: { error: { erreur: string; }; }) => {
        this.erreur = err.error.erreur || "Erreur lors de l'envoi.";
        this.message = '';
      }
    });
  }
}