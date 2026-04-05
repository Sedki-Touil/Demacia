import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AdminService } from '../../../services/admin'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apprenants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apprenants.html',
  styleUrl: './apprenants.scss',
})
export class Apprenants implements OnInit {
  apprenants : any[] = [];
  searchTerm = '';
  allApprenants: any [] = [];

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
      this.loadApprenants();
  }

  getActiveCount(): number {
    return this.apprenants.filter(a => a.isActive !== false).length;
  }

  getInitials(firstName: string, lastName: string) : string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  filterApprenants(): void {
    if (!this.searchTerm) {
      this.apprenants = [...this.allApprenants];
      return;
    }

    const term =  this.searchTerm.toLowerCase();
    this.apprenants = this.allApprenants.filter(apprenant =>
      apprenant.firstName.toLowerCase().includes(term) ||
      apprenant.lastName.toLowerCase().includes(term) ||
      apprenant.email.toLowerCase().includes(term)

    );
  }

  loadApprenants() : void {
    this.adminService.getApprenants().subscribe({
      next : (data) => this.apprenants = data,
      error: (err) => console.error('Error loading apprenants', err)
    });
  }

  viewApprenant(id: number): void {
    console.log('View apprenant', id)
  }

  deleteApprenant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')){
      this.adminService.deleteApprenant(id).subscribe({
        next: () => this.loadApprenants(),
        error: (err) => console.error('Error deleting apprenant', err)
      });
    }
  }
}
