
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { FormateurService } from '../../../services/formateur';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports : [CommonModule, RouterModule],
  templateUrl: './formateur-dashboard.html',
  styleUrl: './formateur-dashboard.scss'
})
export class FormateurDashboard implements OnInit {
  userName = '';
  userEmail = '';
  stats = {
    totalFormations: 0,
    totalApprenants: 0,
    totalSessions: 0,
    tauxReussiteMoyen: 0,
    formationsTerminees: 0
  };
  recentSessions: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private formateurService: FormateurService,
    private router: Router
  ) {
    this.userName = this.authService.getUserName() || 'Formateur';
    this.userEmail = this.authService.getUserEmail() || '';
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentSessions();
  }

  loadStats(): void {
    this.isLoading = true;
    this.formateurService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.isLoading = false;
      }
    });
  }

  loadRecentSessions(): void {
    this.formateurService.getSessions().subscribe({
      next: (data) => {
        this.recentSessions = data.slice(0, 5);
      },
      error: (err) => console.error('Error loading sessions', err)
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
