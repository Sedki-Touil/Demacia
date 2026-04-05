import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Formation, Session, Evaluation} from '../models/formateur';

@Injectable({
  providedIn: 'root',
})
export class FormateurService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.api}/formateur/formations`);
  }

  getFormationById(formationId: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.api}/formateur/formations/${formationId}`);
  }

  getPrerequis(formationId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/formateur/formations/${formationId}/prerequis`);
  }

  addPrerequis(formationId: number, prerequis: string): Observable<void> {
    return this.http.post<void>(`${this.api}/formateur/formations/${formationId}/prerequis`, { nom: prerequis });
  }

  deletePrerequis(formationId: number, prerequis: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/formateur/formations/${formationId}/prerequis/${encodeURIComponent(prerequis)}`);
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.api}/formateur/sessions`);
  }

  getSessionsByFormation(formationId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.api}/formateur/formations/${formationId}/sessions`);
  }

  createSession(session: Partial<Session>): Observable<Session> {
    return this.http.post<Session>(`${this.api}/formateur/sessions`, session);
  }

  updateSession(sessionId: number, session: Partial<Session>): Observable<Session> {
    return this.http.put<Session>(`${this.api}/formateur/sessions/${sessionId}`, session);
  }

  deleteSession(sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/formateur/sessions/${sessionId}`);
  }

  startSession(sessionId: number): Observable<{ lien: string }> {
    return this.http.post<{ lien: string }>(`${this.api}/formateur/sessions/${sessionId}/start`, {});
  }

  getApprenantsByFormation(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/formateur/formations/${formationId}/apprenants`);
  }

  getApprenantProgress(apprenantId: number, formationId: number): Observable<any> {
    return this.http.get(`${this.api}/formateur/apprenants/${apprenantId}/formations/${formationId}/progression`);
  }

  getEvaluations(formationId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.api}/formateur/formations/${formationId}/evaluations`);
  }

  addEvaluation(formationId: number, evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.api}/formateur/formations/${formationId}/evaluations`, evaluation);
  }

  updateEvaluation(evaluationId: number, evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.api}/formateur/evaluations/${evaluationId}`, evaluation);
  }

  deleteEvaluation(evaluationId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/formateur/evaluations/${evaluationId}`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.api}/formateur/stats`);
  }
}
