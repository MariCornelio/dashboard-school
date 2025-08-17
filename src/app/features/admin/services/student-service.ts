import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentModel } from '../../../core/models/student.model';
import { generateUUID } from '../../../core/helpers/uuid.helpers';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiURL = `${environment.apiJsonServerURL}/students`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<StudentModel[]> {
    return this.http.get<StudentModel[]>(
      `${this.apiURL}?_sort=createdAt&_order=desc`
    );
  }

  postStudent(studentData: StudentModel): Observable<StudentModel> {
    const newStudent: StudentModel = {
      ...studentData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    };
    return this.http.post<StudentModel>(`${this.apiURL}`, newStudent);
  }

  updateStudent(
    studentId: string,
    data: StudentModel
  ): Observable<StudentModel> {
    return this.http.patch<StudentModel>(`${this.apiURL}/${studentId}`, data);
  }

  deleteStudent(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${studentId}`);
  }
}
