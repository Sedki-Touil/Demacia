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
  imageUrl?: string;
  inscriptionsCount?: number;
  modulesCount?: number;
}
