export interface CoursesModel {
  id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  durationHours: number;
  mode: string;
  price: number;
  active: boolean;
}
