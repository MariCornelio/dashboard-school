import { CommonModule } from '@angular/common';
import { Component, effect, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { LoaderDialog } from '../../../../shared/components/loader-dialog/loader-dialog';
import { DeleteDialog } from '../../../../shared/components/delete-dialog/delete-dialog';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { StudentStoreService } from '../../services/student-store-service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select, SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { StudentModel } from '../../../../core/models/student.model';
import { GenderLabelPipe } from '../../../../shared/pipes/genderLabel.pipe';
import { ModalStudent } from '../../components/modal-student/modal-student';
import { UsersService } from '../../../../core/services/users-service';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

@Component({
  selector: 'app-students',
  imports: [
    TableModule,
    InputTextModule,
    IconField,
    InputIcon,
    Skeleton,
    Button,
    SelectModule,
    Toast,
    CommonModule,
    LoaderDialog,
    DeleteDialog,
    GenderLabelPipe,
    ModalStudent,
  ],
  templateUrl: './students.html',
  providers: [MessageService],
  styleUrl: './students.css',
})
export class Students {
  skeletonArray = Array(10);
  paginator: boolean = false;
  loadingDeleteStudent: boolean = false;

  genres!: any[];

  //modal
  @ViewChild(ModalStudent) componentModalStudent!: ModalStudent;
  constructor(
    public studentStoreSvc: StudentStoreService,
    private messageService: MessageService,
    private userSvc: UsersService
  ) {
    effect(() => {
      const errorStudent = this.studentStoreSvc.errorStudents();
      if (errorStudent) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorStudent,
        });
      }
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

    this.studentStoreSvc.loadStudentIfNeed();
  }

  openNewStudent(): void {
    this.componentModalStudent.newStudent();
  }
  openEditStudent(student: StudentModel): void {
    this.componentModalStudent.editStudent(student);
  }

  deleteStudent(student: StudentModel): void {
    this.loadingDeleteStudent = true;
    this.userSvc
      .deleteUser(student.userId!)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrio un error al eliminar estudiante',
          });
          console.error('Error al eliminar el usuario estudiante', err);
          return EMPTY;
        }),
        tap(() => {
          this.studentStoreSvc.deleteStudentVerified(student.id!);
          this.messageService.add({
            severity: 'success',
            summary: 'estudiante Eliminado',
            detail: 'El estudiante fue eliminado correctamente',
            life: 5000,
          });
        }),
        finalize(() => {
          this.loadingDeleteStudent = false;
        })
      )
      .subscribe();
  }
}
