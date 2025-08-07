import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { CoursesModel } from '../../../../core/models/courses.model';
import { LoaderDialog } from '../../../../shared/components/loader-dialog/loader-dialog';
import { CoursesStoreService } from '../../services/courses-store-service';
import { DeleteDialog } from '../../../../shared/components/delete-dialog/delete-dialog';
import { MessageService } from 'primeng/api';

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
  ],
  providers: [MessageService],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  skeletonArray = Array(10);
  paginator: boolean = false;
  loadingDeleteCouse: boolean = false;

  constructor(
    public coursesStoreSvc: CoursesStoreService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.coursesStoreSvc.loadCoursesIfNeeded();
  }

  openNewCourse(): void {}
  openEditCourse(): void {}
  deleteCourse(course: CoursesModel): void {}
}
