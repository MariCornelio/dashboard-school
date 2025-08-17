import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast';
import { LoaderDialog } from '../../../../shared/components/loader-dialog/loader-dialog';
import { MessageService } from 'primeng/api';
import { StudentStoreService } from '../../services/student-store-service';
import {
  getErrorMessage,
  isControlInvalid,
} from '../../../../core/helpers/forms-utils.helper';
import { StudentModel } from '../../../../core/models/student.model';
import { KeyFilter } from 'primeng/keyfilter';
import { Select } from 'primeng/select';
import { UserModel, UserRole } from '../../../../core/models/users.model';
import { UsersService } from '../../../../core/services/users-service';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';

type studentFormModel = StudentModel & {
  password?: 'string';
};

@Component({
  selector: 'app-modal-student',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    Message,
    Toast,
    DatePicker,
    KeyFilter,
    Select,
    LoaderDialog,
  ],
  providers: [MessageService],
  templateUrl: './modal-student.html',
  styleUrl: './modal-student.css',
})
export class ModalStudent {
  visible: boolean = false;
  isSaving: boolean = false;
  loaderMessage: string = '';

  genres!: any[];

  filterAlpha: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  studentForm: FormGroup;
  studentFormSubmitted: boolean = false;
  isEditMode: boolean = false;
  getErrorMessage: Function = getErrorMessage;

  student!: StudentModel;

  constructor(
    private builder: FormBuilder,
    private messageService: MessageService,
    private studentStoreSvc: StudentStoreService,
    private userSvc: UsersService
  ) {
    this.studentForm = this.builder.group({
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
      phone: ['', [Validators.pattern('^\\d{9}$')]],
      dni: ['', [Validators.required, Validators.pattern('^\\d{8}$')]],
      password: [''],
      birthDate: [null],
      address: ['', Validators.maxLength(100)],
      gender: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.genres = [
      { label: 'Masculino', value: 'male' },
      {
        label: 'Femenino',
        value: 'female',
      },
      {
        label: 'Otro',
        value: 'other',
      },
    ];
  }

  isInvalid(controlName: string): boolean {
    return isControlInvalid(
      this.studentForm,
      controlName,
      this.studentFormSubmitted
    );
  }

  getDefaultFormValues() {
    return {
      name: '',
      email: '',
      phone: '',
      dni: '',
      password: '',
      birthDate: null,
      gender: null,
      address: '',
    };
  }

  resetFormulario(): void {
    this.studentForm.reset(this.getDefaultFormValues());
    this.studentFormSubmitted = false;
  }

  onSubmit(): void {
    this.studentFormSubmitted = true;
    if (this.studentForm.invalid) return;

    this.isSaving = true;
    const formValues: studentFormModel = this.studentForm.value;

    const studentData: StudentModel = {
      name: formValues.name,
      email: formValues.email,
      gender: formValues.gender,
      dni: formValues.dni,
    };
    if (formValues.birthDate)
      studentData['birthDate'] = (formValues.birthDate as Date).toISOString();
    if (formValues.phone) studentData['phone'] = formValues.phone;
    if (formValues.address) studentData['address'] = formValues.address;

    const userData: UserModel = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    };

    //modo edicion
    const { password, ...userDataWithoutPassword } = userData;
    if (!this.isEditMode) {
      this.loaderMessage = 'Guardando estudiante';
      this.userSvc
        .createUser(userData, UserRole.STUDENT)
        .pipe(
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al guardar estudiante',
              detail: 'No se pudo guardar el estudiante. Inténtalo nuevamente.',
            });
            console.error('fallo al guardar el usuario estudiante', err);
            return EMPTY;
          }),
          switchMap((user) => {
            const studentDataWithUser = {
              ...studentData,
              userId: user.id,
            };
            return this.studentStoreSvc.createStudent(studentDataWithUser);
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al guardar estudiante',
              detail: 'No se pudo guardar el estudiante. Inténtalo nuevamente.',
            });
            console.error('fallo al guardar el usuario estudiante', err);
            return EMPTY;
          }),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Guardado exitosamente',
              detail: 'El estudiante se ha creado exitosamente',
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
      this.loaderMessage = 'Actualizando estudiante';
      this.userSvc
        .updateUser(this.student.userId!, userDataWithoutPassword)
        .pipe(
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al actualizar estudiante',
              detail:
                'No se pudo actualizar el estudiante. Inténtalo nuevamente.',
            });
            console.error('fallo al actualizar el usuario estudiante', err);
            return EMPTY;
          }),
          switchMap(() => {
            return this.studentStoreSvc.updateStudent(
              this.student.id!,
              studentData
            );
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al editar estudiante',
              detail: 'No se pudo guardar el estudiante. Inténtalo nuevamente.',
            });
            console.error('Fallo al actualizar estudiante', err);
            return EMPTY;
          }),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Estudiante actualizado',
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

  newStudent(): void {
    this.visible = true;
    this.isEditMode = false;
    this.student = {};
    this.studentForm
      .get('password')
      ?.setValidators([Validators.required, Validators.maxLength(20)]);
    this.studentForm.get('password')?.updateValueAndValidity();
  }

  editStudent(student: StudentModel): void {
    this.visible = true;
    this.isEditMode = true;
    this.student = { ...student };

    this.studentForm.patchValue({
      name: student.name || '',
      email: student.email || '',
      dni: student.dni || '',
      phone: student.phone || '',
      birthDate: student.birthDate || null,
      gender: student.gender || '',
      address: student.address || '',
    });

    this.studentForm.get('password')?.clearValidators();
    this.studentForm.get('password')?.updateValueAndValidity();
  }
}
