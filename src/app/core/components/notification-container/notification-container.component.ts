import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationType } from '../../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notification of notifications; track notification.id) {
        <div 
          class="notification notification-{{ notification.type }} notification-{{ notification.state }}"
          [id]="'notification-' + notification.id"
        >
          <div class="notification-content">
            <span class="notification-icon">{{ getIcon(notification.type) }}</span>
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close" (click)="remove(notification.id)">&times;</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 450px;
    }
    
    .notification {
      margin-bottom: 12px;
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .notification-enter {
      transform: translateX(100%);
      opacity: 0;
    }
    
    .notification-enter-active {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-exit {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-exit-active {
      transform: translateX(100%);
      opacity: 0;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .notification-icon {
      font-size: 18px;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .notification-message {
      flex: 1;
      line-height: 1.4;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin-left: 8px;
      flex-shrink: 0;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    .notification-success {
      background: #10b981;
    }
    
    .notification-error {
      background: #ef4444;
    }
    
    .notification-warning {
      background: #f59e0b;
    }
    
    .notification-info {
      background: #3b82f6;
    }
    
    @media (max-width: 640px) {
      .notification-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  
  notifications: Array<{
    id: number;
    type: NotificationType;
    message: string;
    state: 'enter' | 'enter-active' | 'exit' | 'exit-active';
  }> = [];

  ngOnInit() {
    // S'abonner aux notifications
    // this.notificationService.setViewContainerRef({} as any); // Pour compatibilité
    
    // Simuler l'abonnement aux notifications
    // En réalité, le service notifierait ce composant quand une nouvelle notification est ajoutée
  }

  @HostListener('document:notification', ['$event'])
  onNotificationEvent(event: Event) {
    const customEvent = event as CustomEvent;
    const { type, message, duration } = customEvent.detail;
    this.add(type, message, duration);
  }

  add(type: NotificationType, message: string, duration = 5000): void {
    const id = Date.now();
    const notification = {
      id,
      type,
      message,
      state: 'enter' as const
    };
    
    this.notifications.push(notification);
    
    // Déclencher l'animation d'entrée
    setTimeout(() => {
      notification.state = 'enter-active' as any;
    }, 10);
    
    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.state = 'exit';
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 300);
    }
  }

  getIcon(type: NotificationType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'i';
      default: return '•';
    }
  }

  ngOnDestroy() {
    this.notifications = [];
  }
}