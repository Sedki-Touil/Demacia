import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { roleGuard } from './guard/role-guard';

import { Formations } from './pages/formateur/formations/formations';
import { Sessions } from './pages/formateur/sessions/sessions';
import { Evaluations } from './pages/formateur/evaluations/evaluations';
import { ApprenantsFormateur } from './pages/formateur/apprenants/apprenants';
import { Statistiques } from './pages/formateur/statistiques/statistiques';
import  {Prerequis} from 

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'admin', component: AdminDashboard,
    canActivate : [roleGuard],
    data: { role : 'ADMIN'},
  },
  { path: 'formateur', component: FormateurDashboard,
    canActivate: [roleGuard],
    data: { role: 'FORMATEUR' },
    children: [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: FormateurDashboard },
  { path: 'formations', component: Formations },
  { path: 'formations/:id', component: FormationDetails },
  { path: 'prerequis', component: Prerequis },
  { path: 'sessions', component: Sessions },
  { path: 'evaluations', component: Evaluations },
  { path: 'apprenants', component: ApprenantsFormateur },
  { path: 'statistiques', component: Statistiques }
]

  },
  { path: 'apprenant', component: ApprenantDashboard, canActivate: [roleGuard], data: { role: 'APPRENANT' } },
];
