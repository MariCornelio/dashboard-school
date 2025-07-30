import { Component, OnInit, ViewChild } from '@angular/core';
import { TeacherModel } from '../../../../core/models/teacher.model';
import { CoursesModel } from '../../../../core/models/courses.model';
import { TeachersService } from '../../services/teachers-service';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Avatar } from 'primeng/avatar';
import { AssignmentsService } from '../../services/assignments-service';
import { ModalTeacher } from '../../components/modal-teacher/modal-teacher';

@Component({
  selector: 'app-teachers',
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    CardModule,
    FormsModule,
    CommonModule,
    Skeleton,
    Toast,
    Avatar,
    ModalTeacher,
  ],
  providers: [MessageService],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class Teachers implements OnInit {
  teachers!: TeacherModel[];
  teachersCoursesMap: Record<string, CoursesModel[]> = {};
  //un loader para los cursos de cada celda correspondiente a cada profesor
  loadingCoursesMap: Record<string, boolean> = {};
  loading: boolean = true;
  paginator: boolean = false;
  skeletonArray = Array(10);
  //para el loader que se ejecuta antes de traer todas las asignaciones de cada profesor
  loadingAssignmentsTeacher: Record<string, boolean> = {};

  //Se coloca para que no salgan varios toast de error
  errorShow: boolean = false;

  //modal
  @ViewChild(ModalTeacher) componentModalTeacher!: ModalTeacher;

  constructor(
    private teachersSvc: TeachersService,
    private assignmentSvc: AssignmentsService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.teachersSvc
      .getTeachers()
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar profesores',
          });
          console.error('error al cargar profesores', err);
          return of([]);
        }),
        tap((teachers: TeacherModel[]) => {
          this.teachers = teachers;
          if (this.teachers.length) this.paginator = true;
        }),
        finalize(() => {
          this.loading = false;
          this.loadAllCourses();
        })
      )
      .subscribe();
  }

  loadAllCourses(): void {
    this.teachers.forEach((teacher) => this.loadCoursesForTeacher(teacher.id));
  }

  loadCoursesForTeacher(teacherId: string | undefined) {
    if (teacherId) {
      this.loadingCoursesMap[teacherId] = true;
      this.assignmentSvc
        .getCoursesByTeacher(teacherId)
        .pipe(
          catchError((err) => {
            if (!this.errorShow) {
              this.errorShow = true;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'Hubo errores al cargar los cursos de uno o más docentes.',
              });
            }

            console.error('Error al cargar cursos', err);
            return of([]);
          }),
          tap((courses: CoursesModel[]) => {
            this.teachersCoursesMap[teacherId] = courses;
          }),
          finalize(() => {
            this.loadingCoursesMap[teacherId] = false;
          })
        )
        .subscribe();
    }
  }

  //modal
  openNewTeacher(): void {
    this.componentModalTeacher.newTeacher();
  }

  openEditTeacher(teacher: TeacherModel, courses: CoursesModel[]): void {
    this.loadingAssignmentsTeacher[teacher.id!] = true;
    this.assignmentSvc
      .getAssignmentsByTeacher(teacher.id!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrio un error al cargar profesor',
          });
          console.error('Error al obtener las asignaciones del profesor', err);
          return throwError(() => err);
        }),
        tap((assignments) => {
          this.componentModalTeacher.editTeacher(teacher, courses, assignments);
        }),
        finalize(() => {
          this.loadingAssignmentsTeacher[teacher.id!] = false;
        })
      )
      .subscribe();
  }
}
