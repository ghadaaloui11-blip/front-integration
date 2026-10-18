import { InjectionToken } from '@angular/core';

/** URL de base du backend. À surcharger en production via provide(API_BASE, ...) dans app.config.ts */
export const API_BASE = new InjectionToken<string>('URL de base de API', {
  providedIn: 'root',
  factory: () => 'http://localhost:5000',
});
