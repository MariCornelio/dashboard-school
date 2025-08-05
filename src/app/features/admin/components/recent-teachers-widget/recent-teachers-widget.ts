import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { TeacherStoreService } from '../../services/teacher-store-service';
import { Avatar } from 'primeng/avatar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recent-teachers-widget',
  imports: [TableModule, CommonModule, Skeleton, Avatar, RouterModule],
  templateUrl: './recent-teachers-widget.html',
  styleUrl: './recent-teachers-widget.css',
})
export class RecentTeachersWidget {
  skeletonArray = Array(5);
  constructor(public teachersStoreSvc: TeacherStoreService) {}
}
