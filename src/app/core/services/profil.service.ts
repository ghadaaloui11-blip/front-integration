import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface Profil {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  role: string;
}

export interface ProfilForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface ReponseProfil {
  message: string;
  utilisateur: Profil;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private http = inject(HttpClient);
  private api = `${inject(API_BASE)}/api/users/profile`;

  /** US04 : voir mon profil. */
  getProfil(): Observable<Profil> {
    return this.http.get<Profil>(this.api);
  }

  /** US04 : modifier mon profil (le backend renvoie un nouveau token). */
  modifier(data: ProfilForm): Observable<ReponseProfil> {
    return this.http.put<ReponseProfil>(this.api, data);
  }
}