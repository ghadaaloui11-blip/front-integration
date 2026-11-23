import { Injectable, inject } from '@angular/core';
import { ComponentRef, InjectableType, TemplateRef, ViewContainerRef } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private viewContainerRef: ViewContainerRef | null = null;
  private notifications: Map<number, ComponentRef<any>> = new Map();
  private nextId = 1;

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  show(message: string, type: NotificationType = 'info', duration = 5000): void {
    if (!this.viewContainerRef) return;

    const notification = {
      id: this.nextId++,
      type,
      message,
      duration
    };

    // Créer un élément de notification dans le DOM
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification notification-${type}`;

    const content = document.createElement('div');
    content.className = 'notification-content';

    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = this.getIcon(type);

    const msg = document.createElement('span');
    msg.className = 'notification-message';
    msg.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '\u00D7';

    content.append(icon, msg, closeBtn);
    notificationElement.appendChild(content);

    // Ajouter au DOM
    document.body.appendChild(notificationElement);

    // Animation d'entrée
    setTimeout(() => {
      notificationElement.classList.add('notification-show');
    }, 10);

    // Gérer la fermeture
    const closeButton = notificationElement.querySelector('.notification-close');
    closeButton?.addEventListener('click', () => this.remove(notificationElement, notification.id));

    // Auto-suppression après la durée
    if (duration > 0) {
      setTimeout(() => this.remove(notificationElement, notification.id), duration);
    }

    this.notifications.set(notification.id, notificationElement as any);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(element: HTMLElement, id: number): void {
    element.classList.remove('notification-show');
    setTimeout(() => {
      element.remove();
      this.notifications.delete(id);
    }, 300);
  }

  clearAll(): void {
    this.notifications.forEach((element, id) => {
      if (element instanceof HTMLElement) {
        this.remove(element, id);
      }
    });
  }

  private getIcon(type: NotificationType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'i';
      default: return '•';
    }
  }
}
