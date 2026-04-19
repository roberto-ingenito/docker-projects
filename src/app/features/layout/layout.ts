import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, map } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { AuthStore } from '../../core/services/auth.store';

@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconButton,
    MatIcon,
    MatTooltipModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthStore);
  protected themeService = inject(ThemeService);

  protected readonly navItems = [
    { route: 'dashboard', label: 'Dashboard' },
    { route: 'categories', label: 'Categorie' },
    { route: 'transactions', label: 'Transazioni' },
  ];

  isDark = computed(() => this.themeService.theme() === 'dark');

  private activeChild = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.route.firstChild?.snapshot),
    ),
    { initialValue: this.route.firstChild?.snapshot },
  );

  protected pageTitle = computed(() => this.activeChild()?.data['title'] ?? '');
  private currentSegment = computed(() => this.activeChild()?.url[0]?.path ?? '');

  toggleTheme() {
    this.themeService.toggle();
  }

  navigateAndClose(route: string, sidenav: MatSidenav) {
    sidenav.close();
    if (this.currentSegment() !== route) {
      this.router.navigate([route]);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
