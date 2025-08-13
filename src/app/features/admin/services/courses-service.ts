import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesModel } from '../../../core/models/courses.model';
import { environment } from '../../../../environments/environment';
import { generateUUID } from '../../../core/helpers/uuid.helpers';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  //private apiURL = 'http://localhost:8080/courses';
  private apiURL = `${environment.apiJsonServerURL}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<CoursesModel[]> {
    return this.http.get<CoursesModel[]>(
      `${this.apiURL}?_sort=createdAt&_order=desc`
    );
  }

  postCourse(courseData: CoursesModel): Observable<CoursesModel> {
    const newCourse: CoursesModel = {
      ...courseData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
    };
    return this.http.post<CoursesModel>(`${this.apiURL}`, newCourse);
  }

  updateCourse(courseId: string, data: CoursesModel): Observable<CoursesModel> {
    return this.http.patch<CoursesModel>(`${this.apiURL}/${courseId}`, data);
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${courseId}`);
  }
}
