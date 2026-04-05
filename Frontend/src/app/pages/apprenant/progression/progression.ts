import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../../services/apprenant';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-progression',
  imports: [],
  templateUrl: './progression.html',
  styleUrl: './progression.scss',
})
export class Progression implements OnInit {
  progressions: any[] = [];
  formationsCompletees: any[] = [];
  stats: any = {};

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
      this.loadProgressions();
      this.loadFormationCompletees();
      this.loadStats();
  }

  loadProgressions(): void {
    this.apprenantService.getProgressionGlobale().subscribe({
      next: (data) => this.progressions = data
    });
  }

  loadFormationCompletees(): void {
    this.apprenantService.getFormationsCompletees().subscribe({
      next: (data) => this.formationsCompletees = data
    });
  }

  loadStats(): void {
    this.apprenantService.getStats().subscribe({
      next: (data) => this.stats = data
    });
  }

  downloadCertificate(formationId: number): void {
    this.apprenantService.peutObtenirAttestation(formationId).subscribe({
      next: (result) => {
        if (result.peutObtenir){
          this.apprenantService.telechargerAttestation(formationId).subscribe({
            next: (blob) => {
              saveAs(blob, `attestation_${formationId}.pdf`);
            }
          });
        } else {
          alert(`Progression: ${result.progression}% - Formation non terminée`);
        }
      }
    })
  }

}
