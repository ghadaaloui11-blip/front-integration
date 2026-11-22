import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface ResultatRecherche {
  campagnes:    ItemRecherche[];
  signalements: ItemRecherche[];
  evenements:   ItemRecherche[];
  associations: ItemRecherche[];
}

export interface ItemRecherche {
  id:          string;
  type:        string;
  titre:       string;
  description: string;
  statut?:     string;
  ville?:      string;
  categorie?:  string;
  auteur?:     string;
}

@Injectable({ providedIn: 'root' })
export class RechercheService {
  private http = inject(HttpClient);
  private api  = `${inject(API_BASE)}/api/search`;

  chercher(q: string = '', type?: string): Observable<ResultatRecherche> {
    let params = new HttpParams();
    if (q) params = params.set('q', q);
    if (type) params = params.set('type', type);
    return this.http.get<ResultatRecherche>(this.api, { params });
  }
}
