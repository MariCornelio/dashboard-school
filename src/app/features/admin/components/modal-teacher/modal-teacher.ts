import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import {
  getErrorMessage,
  isControlInvalid,
} from '../../../../core/helpers/forms-utils.helper';
import { CoursesModel } from '../../../../core/models/courses.model';
import { CoursesService } from '../../services/courses-service';
import {
  catchError,
  finalize,
  forkJoin,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { TeacherModel } from '../../../../core/models/teacher.model';
import { TeachersService } from '../../services/teachers-service';
import { AssignmentsService } from '../../services/assignments-service';
import { AssignmentsModel } from '../../../../core/models/assignments.model';

type CourseWithAssignment = CoursesModel & { assignmentId?: string };
type teacherFormModel = TeacherModel & {
  courses: CoursesModel[];
  password?: 'string';
};

@Component({
  selector: 'app-modal-teacher',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    Dialog,
    FileUpload,
    InputTextModule,
    KeyFilterModule,
    MessageModule,
    ToastModule,
    MultiSelectModule,
    ChipModule,
    ToggleSwitchModule,
    Tooltip,
  ],
  providers: [MessageService],
  templateUrl: './modal-teacher.html',
  styleUrl: './modal-teacher.css',
})
export class ModalTeacher implements OnInit {
  visible: boolean = false;
  files!: File[];
  courses: CoursesModel[] = [];
  loadingCourses: boolean = true;

  filterAlpha: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  filterAlphaNum: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/;

  teacherForm: FormGroup;
  teacherFormSubmitted: boolean = false;

  getErrorMessage: Function = getErrorMessage;

  teacher!: TeacherModel;
  imageUrlTeacher: string = '';
  isEditMode: boolean = false;

  currentAssignments!: AssignmentsModel[];

  @ViewChild('uploadImage') uploadImage!: FileUpload;

  constructor(
    private builder: FormBuilder,
    private coursesSvc: CoursesService,
    private messageService: MessageService,
    private teacherSvc: TeachersService,
    private assignmentsSvc: AssignmentsService
  ) {
    this.teacherForm = this.builder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\\s]+$'),
          Validators.maxLength(50),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      phone: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      dni: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
      password: [''],
      specialty: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\\s]+$'),
          Validators.maxLength(100),
        ],
      ],
      courses: [[]],
      active: [false],
    });
  }

  ngOnInit(): void {
    this.coursesSvc
      .getCourses()
      .pipe(
        catchError((err) => {
          this.loadingCourses = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar cursos',
          });
          console.log('Error al cargar cursos', err);
          return of([]);
        }),
        tap((courses) => {
          this.courses = courses;
        }),
        finalize(() => {
          this.loadingCourses = false;
        })
      )
      .subscribe();
  }

  isInvalid(controlName: string): boolean {
    return isControlInvalid(
      this.teacherForm,
      controlName,
      this.teacherFormSubmitted
    );
  }

  removeCourse(courseToRemove: CoursesModel): void {
    const currentCourses: CoursesModel[] =
      this.teacherForm.get('courses')?.value || [];

    const updatedCourses: CoursesModel[] = currentCourses.filter(
      (course: CoursesModel) => course.id !== courseToRemove.id
    );
    this.teacherForm.get('courses')?.setValue(updatedCourses);
  }

  getDefaultFormValues() {
    return {
      name: '',
      email: '',
      phone: '',
      dni: '',
      password: '',
      specialty: '',
      courses: [],
      active: false,
    };
  }
  resetFormulario(): void {
    this.teacherForm.reset(this.getDefaultFormValues());
    this.teacherFormSubmitted = false;
    //limpiar imagenes de archivos subidos
    this.uploadImage.clear();
  }

  onSubmit(): void {
    this.teacherFormSubmitted = true;
    if (this.teacherForm.invalid) return;
    // si el formulario es valido

    const formValues: teacherFormModel = this.teacherForm.value;
    console.log(formValues);

    const teacherData: TeacherModel = {
      name: formValues.name,
      email: formValues.email,
      dni: formValues.dni,
      phone: formValues.phone,
      specialty: formValues.specialty,
      active: formValues.active,
    };

    const selectedCourses: CoursesModel[] = formValues.courses;

    if (!this.isEditMode) {
      this.teacherSvc
        .saveTeacher(teacherData)
        .pipe(
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al guardar profesor',
              detail: 'No se pudo guardar el profesor. Inténtalo nuevamente.',
            });
            console.error('fallo al guardar profesor', err);
            return throwError(() => err);
          }),
          switchMap((teacher) => {
            const assignments: AssignmentsModel[] = selectedCourses.map(
              (course) => ({
                teacherId: teacher.id!,
                courseId: course.id!,
              })
            );
            if (assignments.length === 0) {
              return of([]);
            }
            const requests = assignments.map((a) =>
              this.assignmentsSvc.saveAssignments(a)
            );
            return forkJoin(requests).pipe(
              catchError((err) => {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Error al asignar cursos',
                  detail:
                    'El profesor fue guardado, pero falló la asignación de cursos.',
                });
                console.error('fallo la asignacion de cursos', err);
                return throwError(() => err);
              })
            );
          }),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Guardado exitosamente',
              detail: 'El profesor se a creado exitosamente',
            });
          }),
          finalize(() => {
            this.visible = false;
            this.resetFormulario();
          })
        )
        .subscribe();
    } else {
    }
  }

  onFileSelect(event: FileSelectEvent): void {
    const file: File = event.files[0];

    if (file.size > 1000000) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Imagen demasiado grande',
        detail: 'Solo se permiten imágenes menores a un 1MB.',
      });

      this.uploadImage.clear();
      return;
    }
  }

  showDialog(): void {
    this.visible = true;
  }
  closeDialog(): void {
    this.visible = false;
    this.resetFormulario();
  }

  newTeacher() {
    this.visible = true;
    this.isEditMode = false;
    this.teacher = {};
    this.teacherForm
      .get('password')
      ?.setValidators([Validators.required, Validators.maxLength(20)]);
    this.teacherForm.get('password')?.updateValueAndValidity();
  }

  editTeacher(
    teacher: TeacherModel,
    courses: CoursesModel[],
    assignments: AssignmentsModel[]
  ) {
    this.visible = true;
    this.isEditMode = true;
    this.teacher = { ...teacher };
    this.currentAssignments = assignments.filter(
      (a) => a.teacherId === teacher.id
    );

    this.teacherForm.patchValue({
      name: teacher.name || '',
      email: teacher.email || '',
      dni: teacher.dni || '',
      phone: teacher.phone || '',
      specialty: teacher.specialty || '',
      active: teacher.active ?? false,
      courses: courses || [],
    });
    console.log(this.currentAssignments);

    // this.teacherForm.get('courses')?.setValue(courses);

    this.teacherForm.get('password')?.clearValidators();
    this.teacherForm.get('password')?.updateValueAndValidity();

    if (teacher.image) {
      this.imageUrlTeacher = teacher.image;
    } else {
      this.imageUrlTeacher = 'new-user.png';
    }
  }
}
