import { Component, effect } from '@angular/core';
import { ModalTeacher } from '../../components/modal-teacher/modal-teacher';
import { TeacherStoreService } from '../../services/teacher-store-service';
import { StatsWidgets } from '../../components/stats-widgets/stats-widgets';
import { RecentTeachersWidget } from '../../components/recent-teachers-widget/recent-teachers-widget';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-dashboard-admin',
  imports: [StatsWidgets, RecentTeachersWidget, Toast],
  providers: [MessageService],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin {
  constructor(
    public teachersStoreSvc: TeacherStoreService,
    private messageService: MessageService
  ) {
    effect(() => {
      const error: string | null = this.teachersStoreSvc.errorTeachers();
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      }
    });
  }

  ngOnInit() {
    this.teachersStoreSvc.loadAllTeachers().subscribe();
  }
}
