import { computed, Injectable, signal } from '@angular/core';
import { CoursesModel } from '../../../core/models/courses.model';
import { StudentService } from './student-service';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { StudentModel } from '../../../core/models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentStoreService {
  private _students = signal<StudentModel[]>([]);
  private _loadingStudents = signal<boolean>(false);
  private _errorStudents = signal<string | null>(null);

  readonly students = computed(() => this._students());
  readonly loadingStudents = computed(() => this._loadingStudents());
  readonly errorStudents = computed(() => this._errorStudents());

  constructor(private studentSvc: StudentService) {}
  loadAllStudents(): void {
    this._loadingStudents.set(true);
    this._errorStudents.set(null);
    this.studentSvc
      .getStudents()
      .pipe(
        catchError((err) => {
          this._errorStudents.set('Error al cargar estudiantes');
          console.error('Error al cargar estudiantes', err);
          return of([]);
        }),
        map((students: StudentModel[]) =>
          students.map((student: StudentModel) => {
            if (student.birthDate) {
              student.birthDate = new Date(student.birthDate);
            }
            return student;
          })
        ),
        tap((students: StudentModel[]) => {
          this._students.set(students);
        }),
        finalize(() => {
          this._loadingStudents.set(false);
        })
      )
      .subscribe();
  }
  loadStudentIfNeed(): void {
    if (this._students().length === 0 || !this._students()) {
      this.loadAllStudents();
    }
  }

  createStudent(student: StudentModel): Observable<StudentModel> {
    return this.studentSvc.postStudent(student).pipe(
      tap((newStudent: StudentModel) => {
        this._students.update((prev) => [newStudent, ...prev]);
      })
    );
  }

  updateStudent(
    studentId: string,
    data: StudentModel
  ): Observable<StudentModel> {
    return this.studentSvc.updateStudent(studentId, data).pipe(
      map((student: StudentModel) => {
        if (student.birthDate) {
          student.birthDate = new Date(student.birthDate);
        }
        return student;
      }),
      tap((student: StudentModel) => {
        this._students.update((prev: StudentModel[]) =>
          prev.map((c: StudentModel) =>
            c.id === studentId ? { ...c, ...student } : c
          )
        );
      })
    );
  }

  deleteStudent(studentId: string) {
    return this.studentSvc.deleteStudent(studentId).pipe(
      tap(() => {
        this._students.update((prev) =>
          prev.filter((c: StudentModel) => c.id !== studentId)
        );
      })
    );
  }

  // se hace esto por eliminacion en cascada de json-server
  deleteStudentVerified(studentId: string) {
    this._students.update((prev) =>
      prev.filter((c: StudentModel) => c.id !== studentId)
    );
  }
}
