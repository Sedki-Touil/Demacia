import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin'
import { Formation } from '../../../models/formation';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-formations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formations.html',
  styleUrl: './formations.scss',
})
export class FormationsComponent implements OnInit{
  formations: Formation[] = [];
  formateurs: any[] = [];
  formationForm: FormGroup;
  showForm = false;
  editMode = false;
  selectedFormation: Formation | null = null;
  searchTerm = '';

  constructor (
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.formationForm = this.fb.group({
      titre : ['', Validators.required],
      description: ['', Validators.required],
      duree: ['',[ Validators.required, Validators.min(1)]],
      prix: ['', [ Validators.required, Validators.min(0)]],
      dateDebut:['', Validators.required],
      dateFin:['', Validators.required],
      formateurId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      this.loadFormations();
      this.loadFormateurs();
  }

  loadFormateurs(): void {
    this.adminService.getFormateurs().subscribe({
      next: (data) => this.formateurs = data,
      error : (err) => console.error('Error loading formateurs', err)
    });
  }

  loadFormations(): void {
    this.adminService.getFormations().subscribe({
      next:(data) => {
        this.formations = data;
      },
      error: (err) => console.error('Error loading formations', err)
    });
  }

  isActive(formation: Formation): boolean {
    const today = new Date();
    const dateDebut = new Date(formation.dateDebut);
    const dateFin = new Date(formation.dateFin);

    return today >= dateDebut && today <= dateFin;
  }

  getFormateurName(formateurId: number): string {
    const formateur = this.formateurs.find(f => f.id === formateurId);
    if (formateur) {
      return `${formateur.firstName} ${formateur.lastName}`;
    }
    return 'Non assigné'
  }

  createFormation(): void {
    if(this.formationForm.valid){
      this.adminService.createFormation(this.formationForm.value).subscribe({
        next: () => {
          this.loadFormations();
          this.resetForm();
        },
        error: (err) => console.error('Error creating formation', err)
      });
    }
  }

  editFormation(formation: Formation): void {
    this.editMode= true;
    this.selectedFormation = formation;
    this.formationForm.patchValue({
      titre: formation.titre,
      description: formation.description,
      duree: formation.duree,
      prix: formation.prix,
      dateDebut :formation.dateDebut,
      dateFin : formation.dateFin,
      formateurId: formation.formateurId
    });
    this.showForm = true
  }

  updateFormation(): void {
    if (this.formationForm.valid && this.selectedFormation){
      this.adminService.updateFormation(this.selectedFormation.id, this.formationForm.value).subscribe({
        next: () => {
          this.loadFormations();
          this.resetForm();
        },
        error: (err) => console.error('Error updating formation', err)
      });
    }
  }

  deleteFormation(id: number): void {
    if (confirm('Are you sure you want to delete this formation?')){
      this.adminService.deleteFormation(id).subscribe({
        next: () => this.loadFormations(),
        error: (err) => console.error('Error deleting formation', err)
      });
    }
  }

  resetForm() : void {
    this.formationForm.reset();
    this.showForm = false;
    this.editMode = false;
    this.selectedFormation = null;
  }

  filterFormations(): void {
    if (!this.searchTerm){
      this.loadFormations();
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.formations = this.formations.filter(formation =>
      formation.titre.toLowerCase().includes(term) ||
      formation.description.toLowerCase().includes(term)
    );
  }

}
