import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component/login.component';
import { Inscription } from './features/auth/inscription/inscription';
import { CreateReportComponent } from './features/reports/create-report/report.component/report.component';
import { associationGuard, citoyenGuard } from './core/guards/role.guards';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: Inscription },

  // US05 : création de signalement (citoyen seulement)
  { path: 'signalement', component: CreateReportComponent, canActivate: [citoyenGuard] },

  // US10 : consultation (publique)
  {
    path: 'campagnes',
    loadComponent: () =>
      import('./features/campagnes/campagne-list/campagne-list').then(m => m.CampagneList),
  },
  // US09 : création (association). Doit rester AVANT 'campagnes/:id'
  {
    path: 'campagnes/nouvelle',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/campagnes/campagne-create/campagne-create').then(m => m.CampagneCreate),
  },
  {
    path: 'mes-campagnes',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/campagnes/mes-campagnes/mes-campagnes').then(m => m.MesCampagnes),
  },
  // US12 : détail et avancement
  {
    path: 'campagnes/:id',
    loadComponent: () =>
      import('./features/campagnes/campagne-detail/campagne-detail').then(m => m.CampagneDetail),
  },
  // US07 : signalements vus par l'association
  {
    path: 'association-reports',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/reports/association-reports/association-reports').then(m => m.AssociationReports),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];