export interface UserModel {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  TEACHER = 'ROLE_TEACHER',
  STUDENT = 'ROLE_STUDENT',
}
