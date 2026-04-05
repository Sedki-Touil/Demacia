import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-cours',
  imports: [],
  templateUrl: './cours.html',
  styleUrl: './cours.scss',
})
export class Cours implements OnInit {
  formations: any[] = [];
  isLoading = true;

  constructor(private apprenentService: ApprenantService) {}

  ngOnInit(): void {
      this.loadMesFormations();
  }

  loadMesFormations(): void {
    this.apprenentService.getMesFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getProgress(formationId: number): void {
    this.apprenentService.getProgressionFormation(formationId).subscribe({
      next: (progress) => {
        console.log(`Progression: ${progress.pourcentage}%`)
      }
    });
  }

}
