import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { AdminService} from '../../../services/admin'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-formateurs',
  standalone: true,
  templateUrl: './formateurs.html',
  styleUrl: './formateurs.scss',
  imports: [CommonModule, ReactiveFormsModule],
})
export class Formateurs implements OnInit {
  formateurs: any[] = [];
  showForm = false;
  editMode = false;
  selectedFormateur : any =null;
  formateurForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  )
  {
    this.formateurForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName :['', Validators.required],
      lastName:['', Validators.required],
      phone : [''],
      sepecialite: ['', Validators.required],
      password:['', [Validators.required, Validators.minLength(6)]]

    });
  }

  ngOnInit(): void {
      this.loadFormateurs();
  }

  loadFormateurs(): void {
    this.adminService.getFormateurs().subscribe({
      next: (data) => this.formateurs = data,
      error: (err) => console.error('Error loading formateurs', err)
    });
  }

  createFormateur(): void {
    if (this.formateurForm.valid) {
      this.adminService.createFormateur(this.formateurForm.value).subscribe({
        next : () => {
          this.loadFormateurs()
          this.resetForm();
        },
        error: (err) => console. error('Error creating formateur' , err)
      });
    }
  }

  editFormateur(formateur :any): void {
    this.editMode = true;
    this.selectedFormateur = formateur;
    this.showForm = true;
    this.formateurForm.patchValue({
      email: formateur.email,
      firstName: formateur.firstName,
      lastName: formateur.lastName,
      phone: formateur.phone,
      specialite: formateur.specialite,
      password:''
    })
  }

  updateFormateur(): void {
    if (this.formateurForm.valid && this.selectedFormateur){
      this.adminService.updateFormateur(this.selectedFormateur.id, this.formateurForm.value).subscribe({
        next: () => {
          this.loadFormateurs();
          this.resetForm();
        },
        error: (err) => console.error('Error updating formateur', err)
      });
    }
  }

  deleteFormateur(id: number) : void {
    if (confirm('Are you sure you want to delete this formateur?')){
      this.adminService.deleteFormateur(id).subscribe({
        next : () => this.loadFormateurs(),
        error: (err) => console.error('Error deleting formateur', err)
      });
    }
  }

  resetForm() : void {
    this.formateurForm.reset();
    this.showForm = false;
    this.editMode = false ;
    this.selectedFormateur = null;
  }
}
