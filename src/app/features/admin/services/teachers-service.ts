import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherModel } from '../../../core/models/teacher.model';
import { generateUUID } from '../../../core/helpers/uuid.helpers';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  //private apiURL = 'http://localhost:8080/teachers';
  private apiURL = `${environment.apiJsonServerURL}/teachers`;

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<TeacherModel[]> {
    return this.http.get<TeacherModel[]>(
      `${this.apiURL}?_sort=createdAt&_order=desc`
    );
  }
  saveTeacher(teacherData: TeacherModel): Observable<TeacherModel> {
    const newTeacher: TeacherModel = {
      ...teacherData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    };
    return this.http.post<TeacherModel>(`${this.apiURL}`, newTeacher);
  }
  updateTeacher(
    teacherId: string,
    data: TeacherModel
  ): Observable<TeacherModel> {
    return this.http.patch<TeacherModel>(`${this.apiURL}/${teacherId}`, data);
  }

  deleteTeacher(teacherId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${teacherId}`);
  }
}
