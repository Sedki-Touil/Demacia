export interface Formation {
  id: number;
  titre: string;
  description: string;
  duree: number;
  prix: number;
  dateDebut: string;
  dateFin: string;
  formateurId: number;
  formateurName?: string;
  categorie?: string;
  niveau?: string;
  progression?: number;
  modulesCompletes?: number;
  modulesTotal?: number;
}

export interface Module {
  id: number;
  titre: string;
  description: string;
  duree: number;
  ordre: number;
  formationId: number;
  formationTitre?: string;
  estComplete?: boolean;
  ressources?: Ressource[];
}

export interface Ressource {
  id: number;
  nom: string;
  type: string;
  url: string;
  taille: number;
  moduleId: number;
}

export interface Note {
  id: number;
  titre: string;
  contenu: string;
  moduleId: number;
  formationId: number;
  formationTitre?: string;
  dateCreation: string;
  dateModification: string;
}

export interface Notification {
  id: number;
  titre: string;
  message: string;
  date: string;
  lue: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  lien?: string;
}

export interface Progression {
  formationId: number;
  formationTitre: string;
  modulesTotal: number;
  modulesCompletes: number;
  pourcentage: number;
  dernierModuleId?: number;
  dernierModuleTitre?: string;
  dateDerniereActivite: string;
}
