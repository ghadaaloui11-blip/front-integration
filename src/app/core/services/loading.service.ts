import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingStates = new Map<string, WritableSignal<boolean>>();
  private globalLoading = signal(false);

  // Génère une clé unique pour chaque loader
  private generateKey(component: string, action?: string): string {
    return action ? `${component}-${action}` : component;
  }

  // Crée ou récupère un signal de loading pour une clé donnée
  private getLoadingSignal(key: string): WritableSignal<boolean> {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, signal(false));
    }
    return this.loadingStates.get(key)!;
  }

  // Définit l'état de loading pour un composant/action spécifique
  setLoading(component: string, action?: string, loading: boolean = true): void {
    const key = this.generateKey(component, action);
    const signal = this.getLoadingSignal(key);
    signal.set(loading);
    
    // Met à jour le global loading si c'est le premier loader
    const activeLoadings = Array.from(this.loadingStates.values()).filter(s => s()).length;
    this.globalLoading.set(activeLoadings > 0);
  }

  // Récupère l'état de loading pour un composant/action spécifique
  isLoading(component: string, action?: string): boolean {
    const key = this.generateKey(component, action);
    const signal = this.getLoadingSignal(key);
    return signal();
  }

  // Vérifie si un composant spécifique est en cours de loading
  isComponentLoading(component: string): boolean {
    return Array.from(this.loadingStates.entries()).some(([key, signal]) => 
      key.startsWith(`${component}-`) && signal()
    );
  }

  // Récupère le global loading state
  getGlobalLoading(): boolean {
    return this.globalLoading();
  }

  // Met fin à tous les loaders pour un composant
  clearComponentLoading(component: string): void {
    Array.from(this.loadingStates.entries()).forEach(([key, signal]) => {
      if (key.startsWith(`${component}-`)) {
        signal.set(false);
      }
    });
    this.updateGlobalLoading();
  }

  // Met fin à tous les loaders
  clearAllLoading(): void {
    this.loadingStates.forEach(signal => signal.set(false));
    this.globalLoading.set(false);
  }

  // Met à jour le global loading state
  private updateGlobalLoading(): void {
    const activeLoadings = Array.from(this.loadingStates.values()).filter(s => s()).length;
    this.globalLoading.set(activeLoadings > 0);
  }

  // Méthodes pratiques pour les opérations courantes
  withLoading<T>(
    component: string, 
    action: string, 
    operation: Promise<T> | (() => Promise<T>)
  ): Promise<T> {
    this.setLoading(component, action, true);
    
    try {
      const promise = typeof operation === 'function' ? operation() : operation;
      
      return promise.finally(() => {
        this.setLoading(component, action, false);
      });
    } catch (error) {
      this.setLoading(component, action, false);
      throw error;
    }
  }

  // Loader pour les opérations HTTP courantes
  async withHttpLoading<T>(
    component: string,
    action: string,
    operation: Promise<T>
  ): Promise<T> {
    return this.withLoading(component, action, operation);
  }
}