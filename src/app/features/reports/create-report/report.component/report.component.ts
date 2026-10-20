import { Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalementService } from '../../../../core/services/signalement.service';
const TAILLE_PHOTO_MAX = 10 * 1024 * 1024;
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'})
export class CreateReportComponent implements OnDestroy {
  description = '';
  latitude = '';
  longitude = '';
  estAnonyme = false;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  message = '';
  erreur = '';
  envoi = false;

  private photoInput = viewChild<ElementRef<HTMLInputElement>>('photoInput');

  constructor(private signalementService: SignalementService) {}

  ngOnDestroy() {
    this.revoquerApercu();
  }

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

  retirerGPS() {
    this.latitude = '';
    this.longitude = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0] ?? null;
    this.revoquerApercu();

    if (fichier && fichier.size > TAILLE_PHOTO_MAX) {
      this.erreur = 'La photo ne doit pas dépasser 10 Mo.';
      this.selectedFile = null;
      input.value = '';
      return;
    }

    this.selectedFile = fichier;
    this.photoPreview = fichier ? URL.createObjectURL(fichier) : null;
  }

  retirerPhoto() {
    this.selectedFile = null;
    this.revoquerApercu();
    const input = this.photoInput();
    if (input) input.nativeElement.value = '';
  }

  private revoquerApercu() {
    if (this.photoPreview) {
      URL.revokeObjectURL(this.photoPreview);
      this.photoPreview = null;
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
    this.retirerPhoto();
  }
}
