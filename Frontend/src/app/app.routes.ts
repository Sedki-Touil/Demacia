import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { FormateurDashboard } from './pages/formateur-dashboard/formateur-dashboard';
import { ApprenantDashboard } from './pages/apprenant-dashboard/apprenant-dashboard';
import { roleGuard } from './guard/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashboard, canActivate: [roleGuard], data: { role: 'ADMIN' } },
  { path: 'formateur', component: FormateurDashboard, canActivate: [roleGuard], data: { role: 'FORMATEUR' } },
  { path: 'apprenant', component: ApprenantDashboard, canActivate: [roleGuard], data: { role: 'APPRENANT' } },
];
