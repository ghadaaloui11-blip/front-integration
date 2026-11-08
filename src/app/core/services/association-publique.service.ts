import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface AssociationPublique {
  id: number;
  nom_association: string;
  adresse: string | null;
  telephone: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AssociationPubliqueService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/associations`;

  lister(recherche?: string): Observable<AssociationPublique[]> {
    let params = new HttpParams();
    if (recherche) {
      params = params.set('recherche', recherche);
    }
    return this.http.get<AssociationPublique[]>(`${this.api}/liste`, { params: params });
  }
}