import { computed, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { TeacherModel } from '../../../core/models/teacher.model';
import { TeachersService } from './teachers-service';

@Injectable({
  providedIn: 'root',
})
export class TeacherStoreService {
  private refreshTeacherSubject = new Subject<'create' | 'edit' | 'delete'>();
  private _teachers = signal<TeacherModel[]>([]);
  private _loadingTeachers = signal<boolean>(false);
  private _errorTeachers = signal<string | null>(null);

  get refreshTeacherAction$(): Observable<'create' | 'edit' | 'delete'> {
    return this.refreshTeacherSubject.asObservable();
  }

  constructor(private teachersSvc: TeachersService) {}

  readonly teachers = computed(() => this._teachers());
  readonly loadingTeachers = computed(() => this._loadingTeachers());
  readonly errorTeachers = computed(() => this._errorTeachers());
  readonly teachersWidget = computed(() => this._teachers().slice(0, 5));

  triggerRefreshTeacher(origin: 'create' | 'edit' | 'delete'): void {
    this.refreshTeacherSubject.next(origin);
  }

  loadAllTeachers() {
    this._teachers.set([]);
    this._loadingTeachers.set(true);
    this._errorTeachers.set(null);
    this.teachersSvc
      .getTeachers()
      .pipe(
        catchError((err) => {
          this._errorTeachers.set('Error al cargar profesores');
          console.error('Error al cargar profesores', err);
          return of([]);
        }),
        tap((teachers: TeacherModel[]) => {
          this._teachers.set(teachers);
        }),
        finalize(() => {
          this._loadingTeachers.set(false);
        })
      )
      .subscribe();
  }
}
