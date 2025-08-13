import { computed, Injectable, signal } from '@angular/core';
import { TeacherModel } from '../../../core/models/teacher.model';
import { AssignmentsModel } from '../../../core/models/assignments.model';
import { AssignmentsService } from './assignments-service';
import { catchError, finalize, forkJoin, Observable, of, tap } from 'rxjs';
import { TeacherStoreService } from './teacher-store-service';
import { CoursesModel } from '../../../core/models/courses.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsStoreService {
  private _errorCourses = signal<string | null>(null);
  private _loadingCoursesMap = signal<Record<string, boolean>>({});
  private _coursesTeachersMap = signal<Record<string, TeacherModel[]>>({});
  private _coursesAssignmentsMap = signal<Record<string, AssignmentsModel[]>>(
    {}
  );

  readonly loadingCoursesMap = computed(() => this._loadingCoursesMap());
  readonly coursesTeachersMap = computed(() => this._coursesTeachersMap());
  readonly coursesAssignmentsMap = computed(() =>
    this._coursesAssignmentsMap()
  );

  readonly errorCoursesMap = computed(() => this._errorCourses());

  constructor(
    private assignmentSvc: AssignmentsService,
    private teachersStoreSvc: TeacherStoreService
  ) {}

  createAssignmentsByCourse(
    course: CoursesModel,
    selectedteachers: TeacherModel[]
  ): Observable<AssignmentsModel[]> {
    if (selectedteachers.length === 0) {
      return of([]);
    }
    const assignments: AssignmentsModel[] = selectedteachers.map(
      (teacher: TeacherModel) => ({
        teacherId: teacher.id!,
        courseId: course.id!,
      })
    );
    //TODO:guardar asignaciones para curso en el signal, en este caso es innecesario porque vuelvo a cargar todo en el inicio por el loadallteacher
    const requests = assignments.map((a: AssignmentsModel) =>
      this.assignmentSvc.saveAssignments(a)
    );

    return forkJoin(requests);
  }

  loadAssignmentsAndTeachersForCourse(courseId: string | undefined): void {
    if (courseId) {
      this._loadingCoursesMap.update((prev) => ({
        ...prev,
        [courseId]: true,
      }));
      this._errorCourses.set(null);

      this.assignmentSvc
        .getAssignmentsByCourse(courseId)
        .pipe(
          catchError((err) => {
            console.error(
              `error al cargar asignaciones del curso ${courseId}`,
              err
            );
            this._errorCourses.set(
              'Hubo error al cargar los profesores de uno o mas cursos'
            );
            return of([]);
          }),
          tap((assignments) => {
            this._coursesAssignmentsMap.update((prev) => ({
              ...prev,
              [courseId]: assignments,
            }));

            const teachersId: string[] = assignments.map(
              (a: AssignmentsModel) => a.teacherId
            );

            const filteredCourses: TeacherModel[] = this.teachersStoreSvc
              .teachers()
              .filter((teacher: TeacherModel) =>
                teachersId.includes(teacher.id!)
              );
            this._coursesTeachersMap.update((prev) => ({
              ...prev,
              [courseId]: filteredCourses,
            }));
          }),
          finalize(() => {
            this._loadingCoursesMap.update((prev) => ({
              ...prev,
              [courseId]: false,
            }));
            console.log(
              'teachers de este curso',
              this.coursesTeachersMap()[courseId]
            );
          })
        )
        .subscribe();
    }
  }

  //TODO: igual seria guardar en el signal si se cambia el estado de teachers
  syncAssignmentsForCourse(
    courseId: string,
    selectedTeachers: TeacherModel[],
    currentAssignments: AssignmentsModel[]
  ): Observable<(void | AssignmentsModel)[]> {
    const newTeachersIds: string[] = selectedTeachers.map(
      (teacher: TeacherModel) => teacher.id!
    );
    const currentTeachersIds: string[] = currentAssignments.map(
      (a: AssignmentsModel) => a.teacherId
    );
    const toDelete: AssignmentsModel[] = currentAssignments.filter(
      (a: AssignmentsModel) => !newTeachersIds.includes(a.teacherId)
    );

    const deleteRequest = toDelete.map((a: AssignmentsModel) =>
      this.assignmentSvc.deleteAssignment(a.id!)
    );

    const toAdd: string[] = newTeachersIds.filter(
      (id: string) => !currentTeachersIds.includes(id)
    );

    if (toAdd.length === 0 && toDelete.length === 0) {
      return of([]);
    }

    const postRequests: Observable<AssignmentsModel>[] = toAdd.map(
      (teacherId: string) => {
        const newAssignment: AssignmentsModel = {
          teacherId,
          courseId,
        };
        return this.assignmentSvc.saveAssignments(newAssignment);
      }
    );

    return forkJoin([...deleteRequest, ...postRequests]);
  }
}
