import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../service/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  data = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onRegister() {
    if (!this.data.email || !this.data.password || !this.data.firstName || !this.data.lastName || !this.data.confirmPassword) {
      alert('Tous les champs sont obligatoires');
      return;
    } else if (this.data.password !== this.data.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.auth.register(this.data).pipe(
      catchError(err => {
        let message = 'Erreur lors de l\'inscription';

        if (err?.error?.message) {
          message = err.error.message;
        } else if (typeof err.error === 'string') {
          message = err.error;
        } else if (err?.statusText) {
          message = err.statusText;
        }

        alert(message);
        console.error('Erreur inscription :', err);

        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.router.navigate(['/login']);
      }
    });
  }
}
