import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Skeleton } from 'primeng/skeleton';
import { TableModule, TablePageEvent } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { CoursesModel } from '../../../../core/models/courses.model';
import { LoaderDialog } from '../../../../shared/components/loader-dialog/loader-dialog';
import { CoursesStoreService } from '../../services/courses-store-service';
import { DeleteDialog } from '../../../../shared/components/delete-dialog/delete-dialog';
import { MessageService } from 'primeng/api';
import { TeacherStoreService } from '../../services/teacher-store-service';
import { TeacherModel } from '../../../../core/models/teacher.model';
import { AssignmentsStoreService } from '../../services/assignments-store-service';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalCourse } from '../../components/modal-course/modal-course';

@Component({
  selector: 'app-courses',
  imports: [
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    Skeleton,
    Toast,
    CommonModule,
    LoaderDialog,
    DeleteDialog,
    ModalCourse,
  ],
  providers: [MessageService],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  skeletonArray = Array(10);
  paginator: boolean = false;
  loadingDeleteCourse: boolean = false;
  // loadedTeachers: boolean = false;
  courses$: Observable<CoursesModel[]>;

  @ViewChild('tableCourses') tableCourses!: TablePageEvent;

  //modal
  @ViewChild(ModalCourse) componentModalCourse!: ModalCourse;

  private destroyRef = inject(DestroyRef);

  constructor(
    public coursesStoreSvc: CoursesStoreService,
    private teachersStoreSvc: TeacherStoreService,
    public assignmentsStoreSvc: AssignmentsStoreService,
    private messageService: MessageService
  ) {
    this.courses$ = this.coursesStoreSvc.courses$;
    // effect(() => {
    //   const error: string | null = this.coursesStoreSvc.errorCourses();
    //   const courses: CoursesModel[] = this.coursesStoreSvc.courses();
    //   //no puedo usar el teachers de teachersStore porque la vista profesores aun no esta implementada con el estado local
    //   //TODO:redefinir si la vista de profesores cambia a estado local
    //   if (!this.loadedTeachers && courses.length > 0 && !error) {
    //     teachersStoreSvc.loadAllTeachers();
    //     this.loadedTeachers = true;
    //   }
    // });

    // effect(() => {
    //   const errorCourses: string | null = this.coursesStoreSvc.errorCourses();
    //   const courses: CoursesModel[] = this.coursesStoreSvc.courses();
    //   const errorTeachers: string | null =
    //     this.teachersStoreSvc.errorTeachers();
    //   const teachers: TeacherModel[] = this.teachersStoreSvc.teachers();
    //   const loadingCoursesMap = this.assignmentsStoreSvc.loadingCoursesMap();
    //   const coursesAssignmentsMap =
    //     this.assignmentsStoreSvc.coursesAssignmentsMap();

    //   if (errorCourses || errorTeachers) return;

    //   if (courses.length > 0 && teachers.length > 0) {
    //     courses.forEach((course: CoursesModel) => {
    //       if (
    //         !loadingCoursesMap[course.id!] &&
    //         !coursesAssignmentsMap[course.id!]
    //       ) {
    //         this.assignmentsStoreSvc.loadAssignmentsAndTeachersForCourse(
    //           course.id!
    //         );
    //       }
    //     });
    //   }
    // });

    effect(() => {
      const errorcourseInital: string | null =
        this.coursesStoreSvc.errorCourses();
      const errorCoursesMap = this.assignmentsStoreSvc.errorCoursesMap();
      const errorTeachers = this.teachersStoreSvc.errorTeachers();
      if (errorcourseInital) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorcourseInital,
        });
      }
      if (errorTeachers) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los profesores asignados a los cursos',
        });
      }
      if (errorCoursesMap) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorCoursesMap,
        });
      }
    });
  }

  ngOnInit(): void {
    this.coursesStoreSvc.loadCoursesIfNeeded();
    this.courses$
      .pipe(
        filter((courses: CoursesModel[]) => courses.length > 0),
        tap((courses: CoursesModel[]) => {
          this.teachersStoreSvc.loadAllTeachers();
          courses.forEach((course: CoursesModel) => {
            this.assignmentsStoreSvc.loadAssignmentsAndTeachersForCourse(
              course.id
            );
          });
          setTimeout(() => {
            this.tableCourses.first = this.coursesStoreSvc.currentPageCourse();
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  openNewCourse(): void {
    this.componentModalCourse.newCourse();
    this.coursesStoreSvc.onCurrentPageCourse(0);
  }
  openEditCourse(course: CoursesModel): void {
    this.componentModalCourse.editCourse(course);
  }
  deleteCourse(course: CoursesModel): void {
    this.coursesStoreSvc.onCurrentPageCourse(0);
    this.loadingDeleteCourse = true;
    this.coursesStoreSvc
      .deleteCourse(course.id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrio un error al eliminar curso',
          });
          console.error('Error al eliminar el usuario curso', err);
          return EMPTY;
        }),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Curso Eliminado',
            detail: 'El curso fue eliminado correctamente',
            life: 5000,
          });
        }),
        finalize(() => {
          this.loadingDeleteCourse = false;
        })
      )
      .subscribe();
  }
}
