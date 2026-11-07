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
    notificationElement.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Ajouter au DOM
    document.body.appendChild(notificationElement);

    // Animation d'entrée
    setTimeout(() => {
      notificationElement.classList.add('notification-show');
    }, 10);

    // Gérer la fermeture
    const closeBtn = notificationElement.querySelector('.notification-close');
    closeBtn?.addEventListener('click', () => this.remove(notificationElement, notification.id));

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

// Composant de notification pour Angular (si on veut le faire en composant Angular)
// @Component({
//   selector: 'app-notification',
//   template: `
//     <div class="notification notification-{{ type }}" *ngIf="visible">
//       <div class="notification-content">
//         <span class="notification-icon">{{ getIcon(type) }}</span>
//         <span class="notification-message">{{ message }}</span>
//         <button class="notification-close" (click)="close()">&times;</button>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .notification {
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       padding: 16px 20px;
//       border-radius: 8px;
//       color: white;
//       font-weight: 500;
//       z-index: 10000;
//       opacity: 0;
//       transform: translateX(100%);
//       transition: all 0.3s ease;
//       max-width: 400px;
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//     }
     
//     .notification-show {
//       opacity: 1;
//       transform: translateX(0);
//     }
     
//     .notification-content {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }
     
//     .notification-icon {
//       font-size: 18px;
//       font-weight: bold;
//     }
     
//     .notification-message {
//       flex: 1;
//     }
     
//     .notification-close {
//       background: none;
//       border: none;
//       color: white;
//       font-size: 18px;
//       cursor: pointer;
//       padding: 0;
//       margin-left: 8px;
//     }
     
//     .notification-success {
//       background: #10b981;
//     }
     
//     .notification-error {
//       background: #ef4444;
//     }
     
//     .notification-warning {
//       background: #f59e0b;
//     }
     
//     .notification-info {
//       background: #3b82f6;
//     }
//   `]
// })
// export class NotificationComponent {
//   @Input() type: NotificationType = 'info';
//   @Input() message = '';
//   @Input() duration = 5000;
//   visible = true;

//   private timeoutId: any;

//   ngOnInit() {
//     if (this.duration > 0) {
//       this.timeoutId = setTimeout(() => this.close(), this.duration);
//     }
//   }

//   close() {
//     this.visible = false;
//     clearTimeout(this.timeoutId);
//     setTimeout(() => {
//       // Notifie le parent de supprimer ce composant
//     }, 300);
//   }

//   getIcon(type: NotificationType): string {
//     switch (type) {
//       case 'success': return '✓';
//       case 'error': return '✕';
//       case 'warning': return '⚠';
//       case 'info': return 'i';
//       default: return '•';
//     }
//   }
// }