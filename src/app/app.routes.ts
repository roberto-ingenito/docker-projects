import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Login } from './features/login/login';
import { Signup } from './features/signup/signup';
import { Dashboard } from './features/dashboard/dashboard';
import { Categories } from './features/categories/categories';
import { Transactions } from './features/transactions/transactions';
import { Layout } from './features/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    component: Login,
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    component: Signup,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'categories',
        component: Categories,
      },
      {
        path: 'transactions',
        component: Transactions,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
