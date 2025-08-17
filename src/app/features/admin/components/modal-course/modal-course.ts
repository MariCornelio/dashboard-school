import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { Chip, ChipModule } from 'primeng/chip';
import { Dialog } from 'primeng/dialog';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { Message, MessageModule } from 'primeng/message';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { Toast, ToastModule } from 'primeng/toast';
import { ToggleSwitch, ToggleSwitchModule } from 'primeng/toggleswitch';
import { LoaderDialog } from '../../../../shared/components/loader-dialog/loader-dialog';
import { MessageService } from 'primeng/api';
import { TeacherModel } from '../../../../core/models/teacher.model';
import {
  getErrorMessage,
  isControlInvalid,
} from '../../../../core/helpers/forms-utils.helper';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TeacherStoreService } from '../../services/teacher-store-service';
import { CoursesModel } from '../../../../core/models/courses.model';
import { AssignmentsStoreService } from '../../services/assignments-store-service';
import { AssignmentsModel } from '../../../../core/models/assignments.model';
import { CoursesStoreService } from '../../services/courses-store-service';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { NoSpaceInputDirective } from '../../../../shared/directives/no-space-input.directive';

type CourseFormModel = CoursesModel & {
  teachers: TeacherModel[];
};

@Component({
  selector: 'app-modal-course',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    Message,
    Toast,
    MultiSelect,
    Chip,
    ToggleSwitch,
    DatePicker,
    InputNumber,
    TextareaModule,
    LoaderDialog,
    NoSpaceInputDirective,
  ],
  providers: [MessageService],
  templateUrl: './modal-course.html',
  styleUrl: './modal-course.css',
})
export class ModalCourse {
  visible: boolean = false;
  isSaving: boolean = false;
  loaderMessage: string = '';

  courseForm: FormGroup;
  courseFormSubmitted: boolean = false;
  isEditMode: boolean = false;
  getErrorMessage: Function = getErrorMessage;
  minDate: Date | null = null;

  currentAssignments!: AssignmentsModel[];
  course!: CoursesModel;

  constructor(
    private builder: FormBuilder,
    private messageService: MessageService,
    public teachersStoreSvc: TeacherStoreService,
    private courseStoreSvc: CoursesStoreService,
    private assignmentsStoreSvc: AssignmentsStoreService
  ) {
    this.courseForm = this.builder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      startDate: [null, [Validators.required]],
      endDate: [{ value: null, disabled: true }, [Validators.required]],
      durationHours: [
        null,
        [Validators.required, Validators.max(999), Validators.min(0)],
      ],
      price: [
        null,
        [Validators.required, Validators.max(99999), Validators.min(0)],
      ],
      teachers: [[]],
      active: [false],
    });
  }

  isInvalid(controlName: string): boolean {
    return isControlInvalid(
      this.courseForm,
      controlName,
      this.courseFormSubmitted
    );
  }

  getDefaultFormValues() {
    return {
      name: '',
      description: '',
      startDate: null,
      endDate: { value: null, disabled: true },
      durationHours: null,
      price: null,
      teachers: [],
      active: false,
    };
  }
  resetFormulario(): void {
    this.courseForm.reset(this.getDefaultFormValues());
    this.courseFormSubmitted = false;
  }
  onSelectStartDate(date: Date): void {
    this.minDate = date;
    this.courseForm.get('endDate')?.enable();
  }
  onClearStartDate() {
    this.minDate = null;
    this.courseForm.get('endDate')?.disable();
  }

  //remover teacher de chips
  removeTeacher(teacherToRemove: TeacherModel): void {
    const currentTeachers: TeacherModel[] =
      this.courseForm.get('teachers')?.value || [];

    const updatedCourses: TeacherModel[] = currentTeachers.filter(
      (teacher: TeacherModel) => teacher.id !== teacherToRemove.id
    );
    this.courseForm.get('teachers')?.setValue(updatedCourses);
  }

  onSubmit(): void {
    this.courseFormSubmitted = true;
    if (this.courseForm.invalid) return;
    //si el formulario es valido
    this.isSaving = true;
    const formValues: CourseFormModel = this.courseForm.value;

    const courseData: CoursesModel = {
      name: formValues.name,
      description: formValues.description,
      startDate: (formValues.startDate as Date).toISOString(),
      endDate: (formValues.endDate as Date).toISOString(),
      durationHours: formValues.durationHours,
      price: formValues.price,
      active: formValues.active,
    };

    const selectedteachers: TeacherModel[] = formValues.teachers;

    if (!this.isEditMode) {
      this.loaderMessage = 'Guardando Curso';
      this.courseStoreSvc
        .createCourse(courseData)
        .pipe(
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al crear curso',
              detail: 'No se pudo crear el curso. Inténtalo nuevamente.',
            });
            console.error('Fallo al guardar curso', err);
            return EMPTY;
          }),
          switchMap((course) => {
            return this.assignmentsStoreSvc.createAssignmentsByCourse(
              course,
              selectedteachers
            );
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Error al asignar profesores',
              detail:
                'El profesor fue guardado, pero falló la asignación de profesores.',
            });
            console.error('fallo la asignacion de profesores', err);
            return EMPTY;
          }),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Guardado exitosamente',
              detail: 'El curso se ha creado exitosamente',
              life: 5000,
            });
          }),
          finalize(() => {
            this.isSaving = false;
            this.visible = false;
            this.resetFormulario();
          })
        )
        .subscribe();
    } else {
      this.loaderMessage = 'Actualizando curso';
      this.courseStoreSvc
        .updateCourse(this.course.id!, courseData)
        .pipe(
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar curso',
              detail: 'No se pudo actualizar el curso. Inténtalo nuevamente.',
            });
            console.error('fallo la actualizacion del curso', err);
            return EMPTY;
          }),
          switchMap(() => {
            return this.assignmentsStoreSvc.syncAssignmentsForCourse(
              this.course.id!,
              selectedteachers,
              this.currentAssignments
            );
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia al actualizar curso',
              detail:
                'El curso fue actualizado, pero falló la asignación de profesores.',
            });
            console.error('Fallo la actualizacion de asignaciones', err);
            return EMPTY;
          }),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Curso actualizado',
              detail: 'Los datos se guardaron correctamente',
              life: 5000,
            });
          }),
          finalize(() => {
            this.isSaving = false;
            this.visible = false;
            this.resetFormulario();
          })
        )
        .subscribe();
    }
  }

  showDialog(): void {
    this.visible = true;
  }
  closeDialog(): void {
    this.visible = false;
    this.resetFormulario();
  }
  newCourse(): void {
    this.visible = true;
    this.isEditMode = false;
    this.course = {};
  }

  editCourse(course: CoursesModel): void {
    this.visible = true;
    this.isEditMode = true;
    this.course = { ...course };
    const teachers: TeacherModel[] =
      this.assignmentsStoreSvc.coursesTeachersMap()[course.id!];
    this.currentAssignments =
      this.assignmentsStoreSvc.coursesAssignmentsMap()[course.id!];

    this.courseForm.get('endDate')?.enable();

    this.courseForm.patchValue({
      name: course.name || '',
      description: course.description || '',
      startDate: course.startDate || null,
      endDate: course.endDate || null,
      teachers: teachers || [],
      active: course.active ?? false,
      durationHours: course.durationHours || null,
      price: course.price,
    });
  }
}
