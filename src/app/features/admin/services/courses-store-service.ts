import { computed, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CoursesModel } from '../../../core/models/courses.model';
import { CoursesService } from './courses-service';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesStoreService {
  private _courses = signal<CoursesModel[]>([]);
  private _loadingCourses = signal<boolean>(false);
  private _errorCourses = signal<string | null>(null);

  private _currentPageCourse = signal<number>(0);

  readonly courses = computed(() => this._courses());
  readonly loadingCourses = computed(() => this._loadingCourses());
  readonly errorCourses = computed(() => this._errorCourses());
  readonly cursosWidget = computed(() => this._courses().slice(0, 5));

  readonly currentPageCourse = computed(() => this._currentPageCourse());

  constructor(private coursesSvc: CoursesService) {}

  //observables:
  get courses$(): Observable<CoursesModel[]> {
    return toObservable(this._courses);
  }

  onCurrentPageCourse(page: number): void {
    this._currentPageCourse.set(page);
  }

  loadAllCourses(): void {
    this._loadingCourses.set(true);
    this._errorCourses.set(null);
    this.coursesSvc
      .getCourses()
      .pipe(
        catchError((err) => {
          this._errorCourses.set('Error al cargar cursos');
          console.error('Error al cargar cursos', err);
          return of([]);
        }),
        map((courses: CoursesModel[]) =>
          courses.map((course: CoursesModel) => ({
            ...course,
            startDate: new Date(course.startDate!),
            endDate: new Date(course.endDate!),
          }))
        ),
        tap((courses: CoursesModel[]) => {
          this._courses.set(courses);
        }),
        finalize(() => {
          this._loadingCourses.set(false);
        })
      )
      .subscribe();
  }
  createCourse(course: CoursesModel): Observable<CoursesModel> {
    return this.coursesSvc.postCourse(course).pipe(
      tap((newCourse: CoursesModel) => {
        this._courses.update((prev) => [newCourse, ...prev]);
      })
    );
  }
  updateCourse(courseId: string, data: CoursesModel): Observable<CoursesModel> {
    return this.coursesSvc.updateCourse(courseId, data).pipe(
      map((course: CoursesModel) => ({
        ...course,
        startDate: new Date(course.startDate!),
        endDate: new Date(course.endDate!),
      })),
      tap((course: CoursesModel) => {
        this._courses.update((prev: CoursesModel[]) =>
          prev.map((c: CoursesModel) =>
            c.id === courseId ? { ...c, ...course } : c
          )
        );
      })
    );
  }

  deleteCourse(courseId: string) {
    return this.coursesSvc.deleteCourse(courseId).pipe(
      tap(() => {
        this._courses.update((prev) =>
          prev.filter((c: CoursesModel) => c.id !== courseId)
        );
      })
    );
  }

  loadCoursesIfNeeded(): void {
    if (this._courses().length === 0 || !this._courses()) {
      this.loadAllCourses();
    }
  }
}
