import { Component, OnInit } from '@angular/core';
import { TeacherModel } from '../../../../core/models/teacher.model';
import { TeachersService } from '../../services/teachers-service';
import { tap } from 'rxjs';
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
  ],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class Teachers implements OnInit {
  teachers!: TeacherModel[];
  loading: boolean = true;

  constructor(private teachersSvc: TeachersService) {}
  ngOnInit() {
    this.teachersSvc
      .getTeachers()
      .pipe(
        tap((teachers: TeacherModel[]) => {
          this.teachers = teachers;
          this.loading = false;
        })
      )
      .subscribe({
        error: (err) => {
          this.loading = false;
          console.log('error al cargar productos', err);
        },
      });
  }
}
