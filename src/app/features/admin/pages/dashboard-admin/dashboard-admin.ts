import { Component, effect } from '@angular/core';
import { ModalTeacher } from '../../components/modal-teacher/modal-teacher';
import { TeacherStoreService } from '../../services/teacher-store-service';
import { StatsWidgets } from '../../components/stats-widgets/stats-widgets';
import { RecentTeachersWidget } from '../../components/recent-teachers-widget/recent-teachers-widget';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { CoursesStoreService } from '../../services/courses-store-service';
import { RecentCoursesWidget } from '../../components/recent-courses-widget/recent-courses-widget';

@Component({
  selector: 'app-dashboard-admin',
  imports: [StatsWidgets, RecentTeachersWidget, Toast, RecentCoursesWidget],
  providers: [MessageService],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin {
  constructor(
    public teachersStoreSvc: TeacherStoreService,
    private messageService: MessageService,
    public coursesStoreSvc: CoursesStoreService
  ) {
    effect(() => {
      const errorTeachers: string | null =
        this.teachersStoreSvc.errorTeachers();

      if (errorTeachers) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorTeachers,
        });
      }
    });
    effect(() => {
      const errorCourses: string | null = this.coursesStoreSvc.errorCourses();
      if (errorCourses) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorCourses,
        });
      }
    });
  }

  ngOnInit() {
    this.teachersStoreSvc.loadAllTeachers().subscribe();
    this.coursesStoreSvc.loadCoursesIfNeeded();
  }
}
