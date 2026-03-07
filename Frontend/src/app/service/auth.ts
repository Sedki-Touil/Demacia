import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
  return this.http.post(
    `${this.api}/auth/register`,
    data,
    { responseType: 'text' }
  );
}

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId);
      })
    );
  }


  getToken() { return localStorage.getItem('token'); }
  getRole() { return localStorage.getItem('role'); }
  isLoggedIn() { return !!this.getToken(); }
  logout() { localStorage.clear(); }
}
