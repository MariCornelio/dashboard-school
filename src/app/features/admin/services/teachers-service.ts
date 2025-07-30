import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherModel } from '../../../core/models/teacher.model';
import { generateUUID } from '../../../core/helpers/uuid.helpers';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private apiURL = 'http://localhost:8080/teachers';

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<TeacherModel[]> {
    return this.http.get<TeacherModel[]>(this.apiURL);
  }
  saveTeacher(teacherData: TeacherModel): Observable<TeacherModel> {
    const newTeacher: TeacherModel = { ...teacherData, id: generateUUID() };
    return this.http.post<TeacherModel>(`${this.apiURL}`, newTeacher);
  }
  updateTeacher(
    teacherId: string,
    data: TeacherModel
  ): Observable<TeacherModel> {
    return this.http.put<TeacherModel>(`${this.apiURL}/${teacherId}`, data);
  }
}
