import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { CoursesStoreService } from '../../services/courses-store-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recent-courses-widget',
  imports: [Skeleton, TableModule, RouterModule, CommonModule],
  templateUrl: './recent-courses-widget.html',
  styleUrl: './recent-courses-widget.css',
})
export class RecentCoursesWidget {
  skeletonArray = Array(5);
  constructor(public coursesStoreSvc: CoursesStoreService) {}
}
