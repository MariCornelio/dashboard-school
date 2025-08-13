export interface CoursesModel {
  id?: string;
  name?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  durationHours?: number;
  price?: number;
  active?: boolean;
  createdAt?: string;
}
