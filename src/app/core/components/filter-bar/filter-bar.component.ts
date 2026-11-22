import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/** Valeurs emises par la barre de filtres partagee (US38). */
export interface FilterValues {
  search: string;
  ville: string;
  categorie: string;
  date_debut: string;
  date_fin: string;
  statut: string;
}

const VIDE: FilterValues = {
  search: '',
  ville: '',
  categorie: 'Toutes',
  date_debut: '',
  date_fin: '',
  statut: '',
};

/** Convertit les valeurs de la barre en parametres de requete (vides ignores). */
export function filtresVersParametres(filtres?: Partial<FilterValues>): Record<string, string> {
  const parametres: Record<string, string> = {};
  if (!filtres) return parametres;
  for (const [cle, valeur] of Object.entries(filtres)) {
    if (valeur && valeur !== 'Toutes') {
      parametres[cle] = valeur;
    }
  }
  return parametres;
}

/**
 * Barre de filtres reutilisable pour les listes campagnes / associations /
 * signalements. Le composant ne charge aucune donnee : il emit simplement les
 * valeurs retenues ; chaque page decide comment les envoyer a son API.
 */
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css',
})
export class FilterBarComponent {
  readonly categories = input<readonly string[]>([]);
  readonly showVille = input(true);
  readonly showDates = input(true);
  readonly showSearch = input(true);
  readonly showStatut = input(false);
  readonly statuts = input<readonly { valeur: string; label: string }[]>([]);

  readonly filtresChange = output<FilterValues>();

  readonly valeurs = signal<FilterValues>({ ...VIDE });

  maj(champ: keyof FilterValues, valeur: string): void {
    this.valeurs.update((v) => ({ ...v, [champ]: valeur }));
  }

  appliquer(): void {
    this.filtresChange.emit({ ...this.valeurs() });
  }

  reinitialiser(): void {
    this.valeurs.set({ ...VIDE });
    this.appliquer();
  }
}
