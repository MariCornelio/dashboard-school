import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { CoursesModel } from '../../../core/models/courses.model';
import { AssignmentsModel } from '../../../core/models/assignments.model';
import { generateUUID } from '../../../core/helpers/uuid.helpers';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  private apiURL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAssignmentsByTeacher(teacherId: string): Observable<AssignmentsModel[]> {
    return this.http.get<AssignmentsModel[]>(
      `${this.apiURL}/assignments?teacherId=${teacherId}`
    );
  }

  getCoursesByTeacher(teacherId: string): Observable<CoursesModel[]> {
    return this.http
      .get<AssignmentsModel[]>(
        `${this.apiURL}/assignments?teacherId=${teacherId}`
      )
      .pipe(
        switchMap((assignments) => {
          const coursesIds = assignments.map((a) => a.courseId);
          return this.http
            .get<CoursesModel[]>(`${this.apiURL}/courses`)
            .pipe(
              map((courses) =>
                courses.filter((courses) => coursesIds.includes(courses.id!))
              )
            );
        })
      );
  }

  saveAssignments(
    assignmentData: AssignmentsModel
  ): Observable<AssignmentsModel> {
    const newAssignments: AssignmentsModel = {
      ...assignmentData,
      id: generateUUID(),
    };
    return this.http.post<AssignmentsModel>(
      `${this.apiURL}/assignments`,
      newAssignments
    );
  }
}
