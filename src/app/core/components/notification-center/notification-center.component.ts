import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NotificationsApiService,
  NotificationServeur,
} from '../../services/notifications-api.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.css',
})
export class NotificationCenterComponent implements OnInit {
  service = inject(NotificationsApiService);
  liste: NotificationServeur[] = [];
  ouvert = false;

  ngOnInit() {
    this.service.rafraichirCompteur();
  }

  toggle() {
    this.ouvert = !this.ouvert;
    if (this.ouvert) {
      this.charger();
    }
  }

  charger() {
    this.service.lister().subscribe({
      next: (data) => {
        this.liste = data;
      },
      error: (err) => console.error('Erreur liste notifications', err),
    });
  }

  lire(n: NotificationServeur) {
    if (n.lue) {
      return;
    }
    this.service.marquerLue(n.id).subscribe(() => {
      n.lue = true;
    });
  }

  toutLire() {
    this.service.toutMarquerLu().subscribe(() => {
      this.charger();
    });
  }

  test() {
    this.service.envoyerTest().subscribe({
      next: () => {
        this.charger();
        this.service.rafraichirCompteur();
      },
      error: (err) => console.error('Erreur test', err),
    });
  }
}