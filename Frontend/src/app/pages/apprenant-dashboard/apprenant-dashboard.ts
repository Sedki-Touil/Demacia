import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-apprenant-dashboard',
  imports: [],
  templateUrl: './apprenant-dashboard.html',
  styleUrl: './apprenant-dashboard.scss',
})
export class ApprenantDashboard {

  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/login']); }

}
