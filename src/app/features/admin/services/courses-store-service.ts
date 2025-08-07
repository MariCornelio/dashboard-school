import { computed, Injectable, signal } from '@angular/core';
import { CoursesModel } from '../../../core/models/courses.model';
import { CoursesService } from './courses-service';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesStoreService {
  private _courses = signal<CoursesModel[]>([]);
  private _loadingCourses = signal<boolean>(false);
  private _errorCourses = signal<string | null>(null);

  readonly courses = computed(() => this._courses());
  readonly loadingCourses = computed(() => this._loadingCourses());
  readonly errorCourses = computed(() => this._errorCourses());
  constructor(private coursesSvc: CoursesService) {}

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
        tap((courses: CoursesModel[]) => {
          this._courses.set(courses);
        }),
        finalize(() => {
          this._loadingCourses.set(false);
        })
      )
      .subscribe();
  }
  loadCoursesIfNeeded(): void {
    if (this._courses().length === 0 || !this._courses()) {
      this.loadAllCourses();
    }
  }
}
