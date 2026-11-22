import { Injectable, inject } from '@angular/core';
import { API_BASE } from '../config/api-base.token';

/** US19 : contenu partageable (titre, texte, URL canonique). */
export interface ShareContent {
  title: string;
  text: string;
  url: string;
}

/**
 * US19 : partage social sans dependance externe.
 * - Web Share API quand le navigateur la supporte (mobile notamment) ;
 * - intent URLs pretes a l'emploi (WhatsApp, Facebook, X, LinkedIn, email) ;
 * - repli copie dans le presse-papiers pour navigateurs desktop.
 */
@Injectable({ providedIn: 'root' })
export class ShareService {
  private api = inject(API_BASE);

  /** URL de la page de partage backend (avec balises OG) pour un evenement. */
  urlPartageEvenement(id: number | string): string {
    return `${this.api}/evenements/${encodeURIComponent(String(id))}/partage`;
  }

  /** URL de partage d'une action (defi) dans le SPA. */
  urlPartageDefi(id: number | string): string {
    return `${this.api}/defis/${encodeURIComponent(String(id))}`;
  }

  /** True si le navigateur expose l'API native de partage. */
  get peutPartagerNativement(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      typeof (navigator as Navigator & { share?: unknown }).share === 'function'
    );
  }

  /** Partage natif si disponible, sinon copie du lien. */
  async partager(contenu: ShareContent): Promise<'native' | 'clipboard' | 'cancel'> {
    if (this.peutPartagerNativement) {
      try {
        await (navigator as Navigator & { share: (c: ShareContent) => Promise<void> }).share(contenu);
        return 'native';
      } catch (err) {
        // L'utilisateur a annule la feuille de partage : on ne force pas la copie.
        if (err && (err as { name?: string }).name === 'AbortError') return 'cancel';
        // Sinon on tente le repli presse-papiers.
      }
    }
    await this.copierLien(contenu.url);
    return 'clipboard';
  }

  /** Copie le lien dans le presse-papiers, avec repli pour les vieux navigateurs. */
  async copierLien(url: string): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        return;
      }
    } catch {
      /* on tente le repli ci-dessous */
    }
    // Repli document.execCommand('copy').
    const zone = document.createElement('textarea');
    zone.value = url;
    zone.setAttribute('readonly', '');
    zone.style.position = 'fixed';
    zone.style.opacity = '0';
    document.body.appendChild(zone);
    zone.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(zone);
    }
  }

  private enc = (valeur: string) => encodeURIComponent(valeur);

  lienWhatsApp(contenu: ShareContent): string {
    return `https://wa.me/?text=${this.enc(`${contenu.text} ${contenu.url}`)}`;
  }

  lienFacebook(url: string): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${this.enc(url)}`;
  }

  lienX(contenu: ShareContent): string {
    return `https://twitter.com/intent/tweet?text=${this.enc(contenu.text)}&url=${this.enc(contenu.url)}`;
  }

  lienLinkedIn(url: string): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${this.enc(url)}`;
  }

  lienEmail(contenu: ShareContent): string {
    return `mailto:?subject=${this.enc(contenu.title)}&body=${this.enc(`${contenu.text}\n\n${contenu.url}`)}`;
  }
}
