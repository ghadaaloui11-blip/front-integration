import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';
import { FilterValues, filtresVersParametres } from '../components/filter-bar/filter-bar.component';

export interface AssociationPublique {
  id: number;
  nom_association: string;
  adresse: string | null;
  ville?: string | null;
  categorie?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssociationPubliqueService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/associations`;

  /** US38 : accepte soit une recherche simple, soit le bloc de filtres partage. */
  lister(filtres?: string | Partial<FilterValues>): Observable<AssociationPublique[]> {
    const valeurs: Partial<FilterValues> =
      typeof filtres === 'string' ? { search: filtres } : (filtres ?? {});
    const params = new HttpParams({ fromObject: filtresVersParametres(valeurs) });
    return this.http.get<AssociationPublique[]>(`${this.api}/liste`, { params });
  }
}