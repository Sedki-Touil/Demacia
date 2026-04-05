import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormateurService } from '../../../services/formateur';

@Component({
  selector: 'app-formations',
  imports: [CommonModule, RouterModule],
  templateUrl: './formations.html',
  styleUrl: './formations.scss',
})
export class Formations implements OnInit {
  formations: any[] = [];
  isLoading = true;
  searchTerm = '';

  constructor(private formateurService: FormateurService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.isLoading = true;
    this.formateurService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading formations', err);
        this.isLoading = false;
      }
    });
  }

  get filteredFormations(): any[] {
    if (!this.searchTerm) return this.formations;
    const term = this.searchTerm.toLowerCase();
    return this.formations.filter(f =>
      f.titre.toLowerCase().includes(term) ||
      f.description.toLowerCase().includes(term)
    );
  }

  getTotalApprenants(formationId: number): number {
    return 0;
  }

  getProgressionMoyenne(formationId: number): number {
    return 0;
  }

}
