import { Routes } from '@angular/router';
import { SplashScreenComponent } from './shared/components/splash-screen/splash-screen.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashScreenComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'articles',
        loadComponent: () => import('./features/articles/articles.component').then((m) => m.ArticlesComponent),
      },
      {
        path: 'articles/:id',
        loadComponent: () => import('./features/article-detail/article-detail.component').then((m) => m.ArticleDetailComponent),
      },
      {
        path: 'shelves',
        loadComponent: () => import('./features/shelves/shelves.component').then((m) => m.ShelvesComponent),
      },
      {
        path: 'shelves/:id',
        loadComponent: () => import('./features/shelves/shelf-detail/shelf-detail.component').then((m) => m.ShelfDetailComponent),
      },
      {
        path: 'containers',
        loadComponent: () => import('./features/containers/containers.component').then((m) => m.ContainersComponent),
      },
      {
        path: 'containers/:id',
        loadComponent: () => import('./features/containers/container-detail/container-detail.component').then((m) => m.ContainerDetailComponent),
      },
      {
        path: 'movements',
        loadComponent: () => import('./features/movements/movements.component').then((m) => m.MovementsComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
