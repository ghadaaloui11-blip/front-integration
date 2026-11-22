import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Defi, DefiService } from '../../../core/services/defi.service';

/** US26 : catalog des defis (liste publique). */
@Component({
  selector: 'app-defi-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './defi-list.html',
  styleUrl: './defi-list.css',
})
export class DefiListComponent implements OnInit {
  private service = inject(DefiService);

  defis = signal<Defi[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.lister().subscribe({
      next: (data) => { this.defis.set(data); this.loading.set(false); },
      error: () => { this.error.set('Impossible de charger les défis.'); this.loading.set(false); },
    });
  }
}
