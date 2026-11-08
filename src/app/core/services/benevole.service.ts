import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface BenevoleForm {
  competences: string;
  disponibilites: string;
  ville: string;
  motivation: string;
}

export interface Benevole {
  id: number;
  competences: string;
  disponibilites: string;
  ville: string;
  motivation: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BenevoleService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/benevoles`;

  /** US14 : s'inscrire comme bénévole. */
  inscrire(data: BenevoleForm): Observable<{ message: string; benevole: Benevole }> {
    return this.http.post<{ message: string; benevole: Benevole }>(this.api, data);
  }

  /** US14 : mon profil bénévole (404 si pas encore inscrit). */
  getMonProfil(): Observable<Benevole> {
    return this.http.get<Benevole>(`${this.api}/me`);
  }

  /** US14 : modifier mon profil bénévole. */
  modifier(data: BenevoleForm): Observable<{ message: string; benevole: Benevole }> {
    return this.http.put<{ message: string; benevole: Benevole }>(`${this.api}/me`, data);
  }
}