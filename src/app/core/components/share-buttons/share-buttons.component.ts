import { Component, input, signal } from '@angular/core';
import { ShareContent, ShareService } from '../../services/share.service';

/** US19 : rangee de boutons de partage reutilisable (evenements, defis...). */
@Component({
  selector: 'app-share-buttons',
  standalone: true,
  templateUrl: './share-buttons.component.html',
  styleUrl: './share-buttons.component.css',
})
export class ShareButtonsComponent {
  readonly contenu = input.required<ShareContent>();
  readonly message = signal('');

  constructor(private share: ShareService) {}

  get liens() {
    const c = this.contenu();
    return {
      whatsapp: this.share.lienWhatsApp(c),
      facebook: this.share.lienFacebook(c.url),
      x: this.share.lienX(c),
      linkedin: this.share.lienLinkedIn(c.url),
      email: this.share.lienEmail(c),
    };
  }

  async partagerNativement(): Promise<void> {
    const resultat = await this.share.partager(this.contenu());
    if (resultat === 'clipboard') {
      this.message.set('Lien copié !');
    } else if (resultat === 'native') {
      this.message.set('Partagé !');
    }
  }

  async copier(): Promise<void> {
    await this.share.copierLien(this.contenu().url);
    this.message.set('Lien copié !');
  }
}
