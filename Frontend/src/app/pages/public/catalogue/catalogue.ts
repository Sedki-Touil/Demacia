import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-catalogue',
  imports: [],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.scss',
})
export class Catalogue implements OnInit {
  formations: any[] = [];
  categories: string[] = [];
  searchTerm = '';

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.apprenantService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        if (data.length > 0 && 'categorie' in data[0]){
          this.categories = [...new Set(
            data.map(f => f.categorie).filter((c): c is string => !!c)
          )];
        }
      }
    });
  }

  search(): void {
    if (this.searchTerm) {
      this.apprenantService.getFormations().subscribe({
        next: (data) => {
          this.formations = data.filter(f => f.titre.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }
      });
    } else {
      this.loadFormations();
    }
  }

}
