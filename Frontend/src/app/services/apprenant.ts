import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Progression, Notification, Note, Formation, Module, Ressource, } from '../models/apprenant';

@Injectable({
  providedIn: 'root',
})
export class ApprenantService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.api}/formations`);
  }

  getFormationById(formationId: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.api}/formations/${formationId}`);
  }

  getMesFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.api}/apprenant/mes-formations`);
  }

  getModulesByFormation(formationId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.api}/apprenant/formations/${formationId}/modules`);
  }

  getModuleById(moduleId: number): Observable<Module> {
    return this.http.get<Module>(`${this.api}/apprenant/modules/${moduleId}`);
  }

  getTestValidation(formationId: number): Observable<any> {
    return this.http.get(`${this.api}/formations/${formationId}/test-validation`);
  }

  validerTest(formationId: number, reponses: any[]): Observable<any> {
    return this.http.post(`${this.api}/formations/${formationId}/valider-test`, { reponses });
  }

  inscrireFormation(formationId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/apprenant/formations/${formationId}/inscription`, {});
  }

  estInscrit(formationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/apprenant/formations/${formationId}/est-inscrit`);
  }

  getFavoris(): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.api}/apprenant/favoris`);
  }

  ajouterFavori(moduleId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/apprenant/favoris/${moduleId}`, {});
  }

  retirerFavori(moduleId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/apprenant/favoris/${moduleId}`);
  }

  estFavori(moduleId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/apprenant/favoris/${moduleId}/est-favori`);
  }

  getRessourcesByModule(moduleId: number): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(`${this.api}/apprenant/modules/${moduleId}/ressources`);
  }

  telechargerRessource(ressourceId: number): Observable<Blob> {
    return this.http.get(`${this.api}/apprenant/ressources/${ressourceId}`, { responseType: 'blob' });
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/apprenant/notes`);
  }

  getNotesByFormation(formationId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/apprenant/formations/${formationId}/notes`);
  }

  getNotesByModule(moduleId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}/apprenant/modules/${moduleId}/notes`);
  }

  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.api}/apprenant/notes`, note);
  }

  updateNote(noteId: number, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.api}/apprenant/notes/${noteId}`, note);
  }

  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/apprenant/notes/${noteId}`);
  }

  peutObtenirAttestation(formationId: number): Observable<{ peutObtenir: boolean; progression: number }> {
    return this.http.get<any>(`${this.api}/apprenant/formations/${formationId}/peut-obtenir-attestation`);
  }

  telechargerAttestation(formationId: number): Observable<Blob> {
    return this.http.get(`${this.api}/apprenant/formations/${formationId}/attestation`, { responseType: 'blob' });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.api}/apprenant/notifications`);
  }

  getNotificationsNonLuesCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/apprenant/notifications/non-lues/count`);
  }

  marquerNotificationLue(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.api}/apprenant/notifications/${notificationId}/lue`, {});
  }

  marquerToutesNotificationsLues(): Observable<void> {
    return this.http.put<void>(`${this.api}/apprenant/notifications/toutes/lues`, {});
  }

  getProgressionGlobale(): Observable<Progression[]> {
    return this.http.get<Progression[]>(`${this.api}/apprenant/progression`);
  }

  getProgressionFormation(formationId: number): Observable<Progression> {
    return this.http.get<Progression>(`${this.api}/apprenant/formations/${formationId}/progression`);
  }

  marquerModuleTermine(moduleId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/apprenant/modules/${moduleId}/terminer`, {});
  }

  getDernierePosition(formationId: number): Observable<{ moduleId: number; moduleTitre: string }> {
    return this.http.get<any>(`${this.api}/apprenant/formations/${formationId}/derniere-position`);
  }

  getSessionsByFormation(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/apprenant/formations/${formationId}/sessions`);
  }

  rejoindreSession(sessionId: number): Observable<{ lien: string }> {
    return this.http.get<{ lien: string }>(`${this.api}/apprenant/sessions/${sessionId}/rejoindre`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.api}/apprenant/stats`);
  }

  getFormationsCompletees(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.api}/apprenant/formations-completees`);
  }
}
