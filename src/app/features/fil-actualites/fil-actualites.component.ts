import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilActualitesService, FilActualiteItem, FilActualiteResponse } from '../../core/services/fil-actualites.service';

@Component({
  selector: 'app-fil-actualites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fil-actualites.component.html',
  styleUrl: './fil-actualites.component.css'
})
export class FilActualitesComponent implements OnInit {
  private service = inject(FilActualitesService);

  items = signal<FilActualiteItem[]>([]);
  chargement = signal<boolean>(true);
  erreur = signal<string>('');
  page = signal<number>(1);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.chargement.set(true);
    this.service.lister(this.page(), 20).subscribe({
      next: (res: FilActualiteResponse) => {
        this.items.set(res.items || []);
        this.chargement.set(false);
      },
      error: (err: any) => {
        this.erreur.set(err.error?.erreur || 'Erreur lors du chargement du fil d\'actualités.');
        this.chargement.set(false);
      }
    });
  }

  formatDate(d: string): string {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date.getTime()) ? d : date.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}
