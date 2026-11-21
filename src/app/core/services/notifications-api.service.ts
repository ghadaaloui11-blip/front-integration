import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_BASE } from '../config/api-base.token';

export interface NotificationServeur {
  id: number;
  type: string;
  titre: string;
  message: string;
  lue: boolean;
  date_creation: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
private api = this.base + '/api/notifications';
  nonLues = signal(0);

  lister(page = 1, limit = 20) {
    return this.http.get<NotificationServeur[]>(this.api, {
      params: { page: page, limit: limit },
    });
  }

  rafraichirCompteur() {
    this.http.get<{ total: number }>(this.api + '/non-lues/count').subscribe({
      next: (r) => this.nonLues.set(r.total),
      error: () => {},
    });
  }

  marquerLue(id: number) {
    return this.http.patch(this.api + '/' + id + '/lue', {}).pipe(
      tap(() => this.rafraichirCompteur())
    );
  }

  toutMarquerLu() {
    return this.http.patch(this.api + '/lire-tout', {}).pipe(
      tap(() => this.nonLues.set(0))
    );
  }

  envoyerTest() {
    return this.http.post(this.api + '/test', {});
  }
}