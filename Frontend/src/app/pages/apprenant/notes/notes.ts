import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes implements OnInit {
  notes: any[] = [];
  selectedFormation: number | null = null;
  formations: any[] = [] ;

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
      this.loadAllNotes();
      this.loadMesFormations();
  }

  loadAllNotes(): void {
    this.apprenantService.getNotes().subscribe({
      next: (data) => this.notes = data
    });
  }

  loadMesFormations(): void {
    this.apprenantService.getMesFormations().subscribe({
      next: (data) => this.formations = data
    });
  }

  filtrerByFormation(formationId: number): void {
    this.selectedFormation = formationId;

    this.apprenantService.getNotesByFormation(formationId).subscribe({
      next: (data) => this.notes = data
    });
  }

  createNote(note: any): void {
    this.apprenantService.createNote(note).subscribe({
      next: () => {
        if (this.selectedFormation){
          this.filtrerByFormation(this.selectedFormation);
        } else {
          this.loadAllNotes();
        }
      }
    });
  }

}
