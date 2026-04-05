import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-favoris',
  imports: [],
  templateUrl: './favoris.html',
  styleUrl: './favoris.scss',
})
export class Favoris implements OnInit {
  favoris: any[] = [];

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
      this.loadFavoris();
  }

  loadFavoris(): void {
    this.apprenantService.getFavoris().subscribe({
      next: (data) => this.favoris = data
    });
  }

  removeFavorite(moduleId: number): void {
    this.apprenantService.retirerFavori(moduleId).subscribe({
      next: () => this.loadFavoris()
    });
  }

}
