import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Signalement, SignalementService, labelStatut } from '../../../core/services/signalement.service';

type Feuille = typeof import('leaflet');
type Carte = import('leaflet').Map;
type Marqueur = import('leaflet').Marker;

/** US36 : carte interactive des signalements géolocalisés. */
@Component({
  selector: 'app-carte-signalements',
  standalone: true,
  templateUrl: './carte-signalements.html',
  styleUrl: './carte-signalements.css',
})
export class CarteSignalementsComponent implements AfterViewInit, OnDestroy {
  private service = inject(SignalementService);

  @ViewChild('carte', { static: true }) carteElement!: ElementRef<HTMLDivElement>;

  signalements = signal<Signalement[]>([]);
  chargement = signal(true);
  erreur = signal('');
  cartePret = signal(false);

  private leaflet: Feuille | null = null;
  private carte: Carte | null = null;
  private marqueurs = new Map<number, Marqueur>();

  labelStatut = labelStatut;

  ngAfterViewInit(): void {
    this.charger();
  }

  ngOnDestroy(): void {
    this.carte?.remove();
    this.carte = null;
    this.marqueurs.clear();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set('');
    this.service.listerPublic().subscribe({
      next: async (donnees) => {
        this.signalements.set(donnees ?? []);
        this.chargement.set(false);
        await this.initialiserCarte();
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur ?? 'Impossible de charger les signalements.');
        this.chargement.set(false);
      },
    });
  }

  coordonnees(s: Signalement): [number, number] | null {
    if (s.latitude == null || s.longitude == null) return null;
    const lat = Number(s.latitude);
    const lon = Number(s.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return [lat, lon];
  }

  localises(): Signalement[] {
    return this.signalements().filter((s) => this.coordonnees(s) !== null);
  }

  titreDe(s: Signalement): string {
    return s.titre || s.description || `Signalement #${s.id}`;
  }

  /** Centre la carte sur un signalement et ouvre sa fiche. */
  focus(s: Signalement): void {
    const coords = this.coordonnees(s);
    const marqueur = this.marqueurs.get(s.id);
    if (!coords || !marqueur || !this.carte) return;
    this.carte.setView(coords, Math.max(this.carte.getZoom(), 7), { animate: true });
    marqueur.openPopup();
  }

  private async initialiserCarte(): Promise<void> {
    if (this.carte) {
      this.carte.remove();
      this.carte = null;
      this.marqueurs.clear();
    }

    try {
      this.leaflet ??= await import('leaflet');
      const L = this.leaflet;
      if (!L || !this.carteElement?.nativeElement) return;

      const carte = L.map(this.carteElement.nativeElement, {
        center: [34.0, 9.0],
        zoom: 6,
        scrollWheelZoom: true,
      });
      this.carte = carte;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(carte);

      const points: [number, number][] = [];
      for (const signalement of this.localises()) {
        const coords = this.coordonnees(signalement);
        if (!coords) continue;
        points.push(coords);

        const marqueur = L.marker(coords, { icon: this.creerIcone(L, signalement) })
          .addTo(carte)
          .bindPopup(this.creerPopup(signalement));
        this.marqueurs.set(signalement.id, marqueur);
      }

      if (points.length === 1) {
        carte.setView(points[0], 9);
      } else if (points.length > 1) {
        carte.fitBounds(L.latLngBounds(points).pad(0.2));
      }

      this.cartePret.set(true);
      // Leaflet a besoin de recalculer sa taille après l'affichage des données.
      requestAnimationFrame(() => carte.invalidateSize());
    } catch (err) {
      console.error('[carte-signalements] initialisation impossible', err);
      this.erreur.set('La carte interactive n’a pas pu être chargée.');
    }
  }

  private creerIcone(L: Feuille, s: Signalement) {
    const classe = s.statut === 'resolu' ? 'resolve' : s.statut === 'en_cours' ? 'encours' : 'recu';
    return L.divIcon({
      className: 'marqueur-signalement',
      html: `<span class="point ${classe}"></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -10],
    });
  }

  private creerPopup(s: Signalement): HTMLElement {
    const conteneur = document.createElement('div');
    conteneur.className = 'popup-signalement';

    const titre = document.createElement('strong');
    titre.textContent = this.titreDe(s);
    conteneur.appendChild(titre);

    const statut = document.createElement('p');
    statut.textContent = `Statut : ${labelStatut(s.statut)}`;
    conteneur.appendChild(statut);

    if (s.description) {
      const description = document.createElement('p');
      description.textContent = s.description.slice(0, 180);
      conteneur.appendChild(description);
    }
    if (s.ville) {
      const ville = document.createElement('p');
      ville.textContent = `Ville : ${s.ville}`;
      conteneur.appendChild(ville);
    }
    return conteneur;
  }
}
