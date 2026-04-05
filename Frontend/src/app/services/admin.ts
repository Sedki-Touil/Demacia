import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Formation } from '../models/formation';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private api = environment.apiUrl;

  constructor(private http : HttpClient){}

  getStats(): Observable<any> {
    return this.http.get(`${this.api}/admin/stats`);
  }

  getRecentInscriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/admin/inscriptions/recentes`);
  }

  getFormateurs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/admin/formateurs`);
  }

  getFormateurById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/admin/formateurs/${id}`);
  }

  createFormateur(data: Partial<User> & { password: string; specialite: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/admin/formateurs`, data);
  }

  updateFormateur(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.api}/admin/formateurs/${id}`, data);
  }

  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/formateurs/${id}`);
  }

  getApprenants(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/admin/apprenants`);
  }

  getApprenantById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/admin/apprenants/${id}`);
  }

  deleteApprenant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/apprenants/${id}`);
  }

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.api}/admin/formations`);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.api}/admin/formations/${id}`);
  }

  createFormation(data: Partial<Formation>): Observable<Formation> {
    return this.http.post<Formation>(`${this.api}/admin/formations`, data);
  }

  updateFormation(id: number, data: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.api}/admin/formations/${id}`, data);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/formations/${id}`);
  }

  getApprenantsEligiblesAttestation(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/admin/formations/${formationId}/apprenants-eligibles`);
  }

  generateAttestation(formationId: number, apprenantId: number): Observable<Blob> {
    return this.http.post(`${this.api}/admin/attestations/generate`,
      { formationId, apprenantId },
      { responseType: 'blob' }
    );
  }

  generateMultipleAttestations(formationId: number, apprenantIds: number[]): Observable<Blob> {
    return this.http.post(`${this.api}/admin/attestations/generate-multiple`,
      { formationId, apprenantIds },
      { responseType: 'blob' }
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/admin/categories`);
  }

  createCategory(nom: string): Observable<any> {
    return this.http.post(`${this.api}/admin/categories`, { nom });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/categories/${id}`);
  }

}
