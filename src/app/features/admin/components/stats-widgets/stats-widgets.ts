import { Component } from '@angular/core';
import { TeacherStoreService } from '../../services/teacher-store-service';
import { CoursesStoreService } from '../../services/courses-store-service';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-stats-widgets',
  imports: [Skeleton],
  templateUrl: './stats-widgets.html',
  styleUrl: './stats-widgets.css',
})
export class StatsWidgets {
  constructor(
    public teachersStoreSvc: TeacherStoreService,
    public coursesStoreSvc: CoursesStoreService
  ) {}
}
