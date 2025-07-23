import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherModel } from '../../../core/models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private apiURL = 'http://localhost:8080/teachers';

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<TeacherModel[]> {
    return this.http.get<TeacherModel[]>(this.apiURL);
  }
}
