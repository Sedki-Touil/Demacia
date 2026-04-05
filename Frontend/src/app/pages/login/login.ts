import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';   // ← .service ajouté (souvent la cause)
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthLeft } from '../../components/auth-left/auth-left';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthLeft],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onLogin() {
    // Reset messages précédents
    this.errorMessage = '';

    // Validation simple côté front
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;

    const credentials = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    console.log('Tentative de connexion avec :', credentials);

    this.auth.login(credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        this.loading = false;

        const role = this.auth.getRole();
        console.log('Rôle détecté :', role);

        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'FORMATEUR') {
          this.router.navigate(['/formateur']);
        } else if (role === 'APPRENANT') {
          this.router.navigate(['/apprenant']);
        } else {
          this.errorMessage = 'Rôle non reconnu';
          console.warn('Rôle inconnu :', role);
        }
      },
      error: (err) => {
        this.loading = false;

        console.error('Erreur lors de la connexion :', err);

        // Analyse du statut pour messages plus précis
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.status === 400) {
          this.errorMessage = 'Données invalides (format incorrect)';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur (CORS ou serveur arrêté ?)';
        } else {
          this.errorMessage = 'Erreur serveur (' + (err.status || 'inconnue') + ')';
        }

        // On garde l'alert historique si tu préfères
        alert(this.errorMessage);
      }
    });
  }
}
