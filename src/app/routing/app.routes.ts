import { Routes } from '@angular/router';
import { MainLayout } from '../layout/main-layout/main-layout';
import { DashboardAdmin } from '../features/admin/pages/dashboard-admin/dashboard-admin';
import { Teachers } from '../features/admin/pages/teachers/teachers';
import { Login } from '../features/auth/pages/login/login';
import { DashboardTeacher } from '../features/teacher/pages/dashboard-teacher/dashboard-teacher';

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
