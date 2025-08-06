import { Routes } from '@angular/router';
import { MainLayout } from '../layout/main-layout/main-layout';
import { DashboardAdmin } from '../features/admin/pages/dashboard-admin/dashboard-admin';
import { Teachers } from '../features/admin/pages/teachers/teachers';
import { Login } from '../features/auth/pages/login/login';
import { DashboardTeacher } from '../features/teacher/pages/dashboard-teacher/dashboard-teacher';
import { Courses } from '../features/admin/pages/courses/courses';
import { Students } from '../features/admin/pages/students/students';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'admin',
        data: { role: 'admin' },
        children: [
          {
            path: '',
            component: DashboardAdmin,
          },
          {
            path: 'profesores',
            component: Teachers,
          },
          {
            path: 'cursos',
            component: Courses,
          },
          {
            path: 'alumnos',
            component: Students,
          },
        ],
      },
      {
        path: 'profesor',
        data: { role: 'teacher' },
        children: [
          {
            path: '',
            component: DashboardTeacher,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
];
