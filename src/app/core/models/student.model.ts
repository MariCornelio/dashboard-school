export interface StudentModel {
  id?: string;
  name?: string;
  email?: string;
  dni?: string;
  phone?: string;
  address?: string;
  birthDate?: string | Date;
  gender?: 'male' | 'female' | 'other';
  createdAt?: string;
  userId?: string;
}
