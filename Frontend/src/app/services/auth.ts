import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest , LoginResponse, RegisterRequest } from '../models/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'environment.apiUrl;';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(data: RegisterRequest): Observable<string> {
  return this.http.post(`${this.api}/auth/register`, data, { responseType: 'text' }
  );
}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, data).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());
        localStorage.setItem('userEmail', res.email);
        localStorage.setItem('userName', `${res.firstName} ${res.lastName}`)
      })
    );
  }

  redirectToDashboard(): void {
    const role = this.getRole();
    switch(role) {
      case 'ADMIN': this.router.navigate(['/admin']); break;
      case 'FORMATEUR': this.router.navigate(['/formateur']); break;
      case 'APPRENANT': this.router.navigate(['/apprenant']); break;
      default: this.router.navigate(['/login']);
    }
  }


  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getUserId(): number | null { const id = localStorage.getItem('userId'); return id ? parseInt(id) : null; }
  getUserName(): string | null { return localStorage.getItem('userName'); }
  getUserEmail(): string | null { return localStorage.getItem('userEmail'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isFormateur(): boolean { return this.getRole() === 'FORMATEUR'; }
  isApprenant(): boolean { return this.getRole() === 'APPRENANT'; }
  
  logout() : void {
     localStorage.clear();
  }
}
