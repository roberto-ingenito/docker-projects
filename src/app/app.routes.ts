import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Login } from './features/login/login';
import { Signup } from './features/signup/signup';
import { Dashboard } from './features/dashboard/dashboard';
import { Categories } from './features/categories/categories';
import { Transactions } from './features/transactions/transactions';

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
    path: 'dashboard',
    canActivate: [authGuard],
    component: Dashboard,
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    component: Categories,
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    component: Transactions,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
