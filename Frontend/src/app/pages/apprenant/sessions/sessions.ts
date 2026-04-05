import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-sessions',
  imports: [],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss',
})
export class Sessions implements OnInit{
  sessions: any[] = [];
  formationId: number;

  constructor (
    private route: ActivatedRoute,
    private apprenantService: ApprenantService
  ) {
    this.formationId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
      this.loadSessions();
  }

  loadSessions(): void {
    this.apprenantService.getSessionsByFormation(this.formationId).subscribe({
      next:(data) => this.sessions = data
    });
  }

  joinSession(sessionId: number): void {
    this.apprenantService.rejoindreSession(sessionId).subscribe({
      next: (data) => {
        window.open(data.lien, '_blank');
      }
    });
  }
}
