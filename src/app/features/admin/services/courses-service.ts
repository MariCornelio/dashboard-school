import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesModel } from '../../../core/models/courses.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  //private apiURL = 'http://localhost:8080/courses';
  private apiURL = `${environment.apiJsonServerURL}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<CoursesModel[]> {
    return this.http.get<CoursesModel[]>(this.apiURL);
  }
}
