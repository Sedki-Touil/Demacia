export interface Formation {
  id: number;
  titre: string;
  description: string;
  duree: number;
  prix: number;
  dateDebut: string;
  dateFin: string;
  formateurId: number;
  categorie?: string;
  niveau?: string;
  progressionMoyenne?: number;
  apprenantsCount?: number;
  modulesCount?: number;
}

export interface Session {
  id: number;
  titre: string;
  description: string;
  date: string;
  heure: string;
  duree: number;
  lien: string;
  formationId: number;
  formationTitre?: string;
  statut: 'A_VENIR' | 'EN_COURS' | 'TERMINE';
}

export interface Evaluation {
  id: number;
  apprenantId: number;
  apprenantNom: string;
  formationId: number;
  note: number;
  commentaire: string;
  date: string;
}

export interface Prerequis {
  id?: number;
  nom: string;
  description?: string;
}
