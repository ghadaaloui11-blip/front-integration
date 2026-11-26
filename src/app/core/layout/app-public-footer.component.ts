import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-public-footer.component.html',
  styleUrl: './app-public-footer.component.css',
})
export class AppPublicFooterComponent {}
