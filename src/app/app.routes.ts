import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component/login.component';
import { InscriptionComponent } from './features/auth/inscription/inscription';
import { CreateReportComponent } from './features/reports/create-report/report.component/report.component';
import { associationGuard, citoyenGuard, adminGuard, authGuard } from './core/guards/role.guards';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },

  // US05 : création de signalement (citoyen seulement)
  { path: 'signalement', component: CreateReportComponent, canActivate: [citoyenGuard] },

  // US10 : consultation (publique)
  {
    path: 'campagnes',
    loadComponent: () =>
      import('./features/campagnes/campagne-list/campagne-list').then(m => m.CampagneListComponent),
  },
  // US09 : création (association). Doit rester AVANT 'campagnes/:id'
  {
    path: 'campagnes/nouvelle',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/campagnes/campagne-create/campagne-create').then(m => m.CampagneCreateComponent),
  },
  {
    path: 'mes-campagnes',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/campagnes/mes-campagnes/mes-campagnes').then(m => m.MesCampagnesComponent),
  },
  // Don (citoyen uniquement). Doit rester AVANT 'campagnes/:id'
  {
    path: 'campagnes/:id/don',
    canActivate: [citoyenGuard],
    loadComponent: () =>
      import('./features/campagnes/don/don').then(m => m.DonComponent),
  },
  // US12 : détail et avancement
  {
    path: 'campagnes/:id',
    loadComponent: () =>
      import('./features/campagnes/campagne-detail/campagne-detail').then(m => m.CampagneDetailComponent),
  },
  // US07 : signalements vus par l'association
  {
    path: 'association-reports',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/reports/association-reports/association-reports').then(m => m.AssociationReportsComponent),
  },

  // US02 : dépôt des documents légaux (association)
  {
    path: 'mes-documents',
    canActivate: [associationGuard],
    loadComponent: () =>
      import('./features/associations/depot-documents/depot-documents').then(m => m.DepotDocumentsComponent),
  },

  // US03 : gestion des associations (admin)
  {
    path: 'admin/associations',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/associations/admin-associations/admin-associations').then(m => m.AdminAssociationsComponent),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 404 : toute route inconnue renvoie vers les campagnes
  { path: '**', redirectTo: 'campagnes' },
];