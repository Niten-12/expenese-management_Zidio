//app.routes.ts
import { Routes } from '@angular/router';

// Import components
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin/admin-dashboard';
import { ManagerDashboard } from './pages/manager/manager-dashboard';
import { EmployeeDashboard } from './pages/employee/employee-dashboard';
import { FinanceDashboard } from './pages/finance/finance-dashboard';
import { NotFound } from './pages/not-found/not-found/not-found';
import { Unauthorized } from './pages/unauthorized/unauthorized/unauthorized';
import { CreateUserComponent } from './pages/admin/create-user.component';

// Import guards
import { AdminGuard } from './services/guard/admin.guard';
import { ManagerGuard } from './services/guard/manager.guard';
import { EmployeeGuard } from './services/guard/employee.guard';
import { FinanceGuard } from './services/guard/finance.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'admin', component: AdminDashboard, canActivate: [AdminGuard] },
  {
    path: 'admin/create-user',
    component: CreateUserComponent,
    canActivate: [AdminGuard],
  },

  { path: 'manager', component: ManagerDashboard, canActivate: [ManagerGuard] },

  {
    path: 'employee',
    component: EmployeeDashboard,
    canActivate: [EmployeeGuard],
  },

  { path: 'finance', component: FinanceDashboard, canActivate: [FinanceGuard] },

  { path: 'unauthorized', component: Unauthorized },

  { path: '**', component: NotFound },
];
