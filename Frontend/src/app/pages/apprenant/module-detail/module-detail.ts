import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApprenantService } from '../../../services/apprenant';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-module-detail',
  imports: [],
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.scss',
})
export class ModuleDetail implements OnInit{
   module: any = null;
   ressources: any[] = [];
   isFavori = false;
   notes: any[] = [];
   newNote = { titre: '', contenu: '' };
   showNoteForm = false;

   constructor(
    private route: ActivatedRoute,
    private apprenantService: ApprenantService
  ) {}

  ngOnInit(): void {
    const moduleId = +this.route.snapshot.params['id'];
    this.loadModule(moduleId);
    this.loadRessources(moduleId);
    this.checkFavori(moduleId);
    this.loadNotes(moduleId);
  }

  loadModule(moduleId: number): void {
    this.apprenantService.getModuleById(moduleId).subscribe({
      next: (data) => this.module = data
    });
  }

  loadRessources(moduleId: number): void {
    this.apprenantService.getRessourcesByModule(moduleId).subscribe({
      next: (data) => this.ressources = data
    });
  }

  downloadRessource(ressourceId: number, nom: string): void {
    this.apprenantService.telechargerRessource(ressourceId).subscribe({
      next: (blob) => {
        saveAs(blob, nom);
      }
    });
  }

  checkFavori(moduleId: number): void {
    this.apprenantService.estFavori(moduleId).subscribe({
      next: (data) => this.isFavori = data
    });
  }

  toggleFavori(): void {
    const moduleId = this.module.id;
    if (this.isFavori) {
      this.apprenantService.retirerFavori(moduleId).subscribe({
        next: () => this.isFavori = false
      });
    } else {
      this.apprenantService.ajouterFavori(moduleId).subscribe({
        next: () => this.isFavori = true
      });
    }
  }

  loadNotes(moduleId: number): void {
    this.apprenantService.getNotesByModule(moduleId).subscribe({
      next: (data) => this.notes = data
    });
  }

  addNote(): void {
    const note = {
      ...this.newNote,
      moduleId: this.module.id,
      formationId: this.module.formationId
    };
    this.apprenantService.createNote(note).subscribe({
      next: () => {
        this.loadNotes(this.module.id);
        this.newNote = { titre: '', contenu: '' };
        this.showNoteForm = false;
      }
    });
  }

   updateNote(noteId: number, note: any): void {
    this.apprenantService.updateNote(noteId, note).subscribe({
      next: () => this.loadNotes(this.module.id)
    });
  }

  deleteNote(noteId: number): void {
    if (confirm('Supprimer cette note ?')) {
      this.apprenantService.deleteNote(noteId).subscribe({
        next: () => this.loadNotes(this.module.id)
      });
    }
  }

  markComplete(): void {
    this.apprenantService.marquerModuleTermine(this.module.id).subscribe({
      next: () => {
        alert('Module terminé !');
      }
    });
  }

}
