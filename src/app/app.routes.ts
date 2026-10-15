import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component/login.component';
import { Inscription } from './features/auth/inscription/inscription';
import { CreateReportComponent } from './features/reports/create-report/report.component/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: Inscription }, 
  { path: 'signalement', component: CreateReportComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];