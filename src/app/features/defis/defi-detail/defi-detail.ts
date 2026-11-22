import { Component, OnInit, inject, signal, viewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Defi, DefiService, ParticipationDefi } from '../../../core/services/defi.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShareButtonsComponent } from '../../../core/components/share-buttons/share-buttons.component';
import { ShareContent, ShareService } from '../../../core/services/share.service';

/** US26 : detail d'un defi, adhesion, preuve photo et partage de son action. */
@Component({
  selector: 'app-defi-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, ShareButtonsComponent],
  templateUrl: './defi-detail.html',
  styleUrl: './defi-detail.css',
})
export class DefiDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(DefiService);
  private shareService = inject(ShareService);
  protected auth = inject(AuthService);

  defi = signal<Defi | null>(null);
  participation = signal<ParticipationDefi | null>(null);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');
  successMsg = signal('');
  shareContent = signal<ShareContent | null>(null);

  commentaire = '';
  private photoInput = viewChild<ElementRef<HTMLInputElement>>('photoInput');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.charger(id);
  }

  charger(id: number) {
    this.loading.set(true);
    this.error.set('');
    this.service.voir(id).subscribe({
      next: (defi) => {
        this.defi.set(defi);
        this.shareContent.set({
          title: `Défi : ${defi.titre}`,
          text: `Je relève le défi solidaire « ${defi.titre} » sur MennaFina. Rejoins-moi !`,
          url: this.shareService.urlPartageDefi(defi.id),
        });
        this.loading.set(false);
        if (this.auth.getToken()) this.chargerParticipation(id);
      },
      error: () => {
        this.error.set('Défi introuvable.');
        this.loading.set(false);
      },
    });
  }

  private chargerParticipation(defiId: number) {
    this.service.mesParticipations().subscribe({
      next: (liste) => this.participation.set(liste.find((p) => p.defi_id === defiId) || null),
      error: () => this.participation.set(null),
    });
  }

  rejoindre() {
    const defi = this.defi();
    if (!defi || this.submitting()) return;
    this.submitting.set(true);
    this.error.set('');
    this.service.rejoindre(defi.id).subscribe({
      next: (p) => {
        this.participation.set(p);
        this.successMsg.set('Vous participez à ce défi !');
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Impossible de rejoindre le défi.');
        this.submitting.set(false);
      },
    });
  }

  soumettrePreuve() {
    const defi = this.defi();
    if (!defi || this.submitting()) return;
    const fichier = this.photoInput()?.nativeElement.files?.[0];
    if (!fichier) {
      this.error.set('Veuillez sélectionner une photo de preuve.');
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    this.service.soumettrePreuve(defi.id, fichier, this.commentaire).subscribe({
      next: (p) => {
        this.participation.set(p);
        this.successMsg.set('Preuve envoyée ! Elle sera vérifiée par un administrateur.');
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.erreur || 'Impossible d’envoyer la preuve.');
        this.submitting.set(false);
      },
    });
  }

  pourcentage(): number {
    const defi = this.defi();
    const p = this.participation();
    if (!defi || !p) return 0;
    return Math.min(100, Math.round((p.progression / defi.objectif) * 100));
  }

  libelleStatut(statut?: string): string {
    const libelles: Record<string, string> = {
      en_cours: 'En cours',
      en_attente: 'Preuve en attente de validation',
      complete: 'Terminé 🎉',
      rejete: 'Preuve refusée',
    };
    return (statut && libelles[statut]) || statut || '';
  }
}
