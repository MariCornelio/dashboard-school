import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
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

  syncAssignmentsForTeacher(
    teacherId: string,
    newCoursesIds: string[],
    currentAssignments: AssignmentsModel[]
  ): Observable<(void | AssignmentsModel)[]> {
    const currentCoursesIds: string[] = currentAssignments.map(
      (a: AssignmentsModel) => a.courseId
    );

    const toDelete: AssignmentsModel[] = currentAssignments.filter(
      (a: AssignmentsModel) => !newCoursesIds.includes(a.courseId)
    );
    const deleteRequest = toDelete.map((a: AssignmentsModel) =>
      this.http.delete<void>(`${this.apiURL}/assignments/${a.id}`)
    );

    const toAdd: string[] = newCoursesIds.filter(
      (id: string) => !currentCoursesIds.includes(id)
    );

    if (toAdd.length === 0 && toDelete.length === 0) {
      return of([]); // Devuelve un observable que se completa inmediatamente
    }
    const postRequests: Observable<AssignmentsModel>[] = toAdd.map(
      (courseId: string) => {
        const newAssignments: AssignmentsModel = {
          id: generateUUID(),
          teacherId,
          courseId,
        };
        return this.http.post<AssignmentsModel>(
          `${this.apiURL}/assignments`,
          newAssignments
        );
      }
    );
    return forkJoin([...deleteRequest, ...postRequests]);
  }

  deleteAssignmentsByTeacher(teacherId: string): Observable<void[]> {
    return this.getAssignmentsByTeacher(teacherId).pipe(
      switchMap((assigments) => {
        if (assigments.length === 0) {
          return of([]);
        }
        const deleteRequest = assigments.map((a: AssignmentsModel) =>
          this.http.delete<void>(`${this.apiURL}/assignments/${a.id}`)
        );
        return forkJoin(deleteRequest);
      })
    );
  }
}
