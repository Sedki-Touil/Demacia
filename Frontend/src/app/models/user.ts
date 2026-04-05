export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ApprenantRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface Formateur {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialite: string;
  createdAt: Date;
}
