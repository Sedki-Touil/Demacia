import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.api}/admin/stats`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/admin/users`);
  }

  getFormateurCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/formateur/courses`);
  }

  getMyCourses(): Observable<any[]> {
    const userId = this.auth.getUserId();
    return this.http.get<any[]>(`${this.api}/apprenant/${userId}/courses`);
  }
}

