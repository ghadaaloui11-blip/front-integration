import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    /** Surcharge de l'URL de l'API au deploiement (sans rebuild). */
    __API_BASE__?: string;
  }
}

/**
 * URL de base du backend.
 * Priorite : window.__API_BASE__ (deploiement) > environment.apiBase
 * (http://localhost:5000 en dev, meme origine en production).
 */
export const API_BASE = new InjectionToken<string>("URL de base de l'API", {
  providedIn: 'root',
  factory: () => {
    const surcharge = typeof window !== 'undefined' ? window.__API_BASE__ : undefined;
    return (surcharge ?? environment.apiBase).replace(/\/+$/, '');
  },
});
