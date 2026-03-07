
import { Component } from '@angular/core';
import { AuthService } from '../../service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  templateUrl: './formateur-dashboard.html',
  styleUrl: './formateur-dashboard.scss',
})
export class FormateurDashboard {

  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/login']); }

}
