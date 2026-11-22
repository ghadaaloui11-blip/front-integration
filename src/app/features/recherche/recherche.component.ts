import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RechercheService, ResultatRecherche } from '../../core/services/recherche.service';

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.css'
})
export class RechercheComponent implements OnInit {
  private service = inject(RechercheService);
  private route = inject(ActivatedRoute);

  terme = '';
  typeActif = signal<string>('');
  chargement = signal<boolean>(false);
  erreur = signal<string>('');
  resultats = signal<ResultatRecherche | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.terme = params['q'];
      }
      if (params['type']) {
        this.typeActif.set(params['type']);
      }
      this.lancerRecherche();
    });
  }

  lancerRecherche() {
    this.chargement.set(true);
    this.erreur.set('');

    this.service.chercher(this.terme.trim(), this.typeActif() || undefined).subscribe({
      next: (res: ResultatRecherche) => {
        this.resultats.set(res);
        this.chargement.set(false);
      },
      error: (err: any) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors de la recherche.');
        this.chargement.set(false);
      }
    });
  }

  changerType(type: string) {
    this.typeActif.set(type);
    this.lancerRecherche();
  }

  totalResultats(): number {
    const r = this.resultats();
    if (!r) return 0;
    return (r.campagnes?.length || 0) +
           (r.signalements?.length || 0) +
           (r.evenements?.length || 0) +
           (r.associations?.length || 0);
  }
}
