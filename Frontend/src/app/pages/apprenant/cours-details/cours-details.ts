import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-cours-details',
  imports: [],
  templateUrl: './cours-details.html',
  styleUrl: './cours-details.scss',
})
export class CoursDetails implements OnInit {
  formation: any = null;
  modules: any[] = [];
  testValidation: any = null;
  isInscrit = false;
  showTest = false;
  reponses: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apprenantService: ApprenantService

  ) {}

  ngOnInit(): void {
      const formationId = +this.route.snapshot.params['id'];
      this.loadFormation(formationId);
      this.checkInscription(formationId);
  }

  loadFormation(formationId: number): void {
    this.apprenantService.getFormationById(formationId).subscribe({
      next: (data) => {
        this.formation = data;
        this.loadModules(formationId);
      }
    });
  }

  loadModules(formationId: number): void {
    this.apprenantService.getModulesByFormation(formationId).subscribe({
      next: (data) => this.modules = data
    });
  }

  checkInscription(formationId: number): void {
    this.apprenantService.estInscrit(formationId).subscribe({
      next: (data) => this.isInscrit = data
    });
  }

  loadTestValidation(formationId: number): void {
    this.apprenantService.getTestValidation(formationId).subscribe({
      next: (data) => {
        this.testValidation = data;
        this.showTest = true;
      }
    });
  }

  submitTest(): void {
    const formationId = this.formation.id;
    this.apprenantService.validerTest(formationId, this.reponses).subscribe({
      next: (resultat) => {
        if (resultat.reussi) {
          this.inscrireFormation(formationId);
        } else {
          alert(`Score: ${resultat.pourcentage}% - Test non réussi`);
        }
      }
    });
  }

  inscrireFormation(formationId: number): void {
    this.apprenantService.inscrireFormation(formationId).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.isInscrit = true;
        this.router.navigate(['/apprenant/cours']);
      }
    });
  }

  startModule(moduleId: number): void {
    this.router.navigate(['/apprenant/module', moduleId]);
  }

}
