import { Component } from '@angular/core';
import { TeacherStoreService } from '../../services/teacher-store-service';

@Component({
  selector: 'app-stats-widgets',
  imports: [],
  templateUrl: './stats-widgets.html',
  styleUrl: './stats-widgets.css',
})
export class StatsWidgets {
  constructor(public teachersStoreSvc: TeacherStoreService) {}
}
