import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component/login.component';
import { CreateReportComponent } from './features/reports/create-report/report.component/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signalement', component: CreateReportComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];