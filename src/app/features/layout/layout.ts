import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter, map } from 'rxjs';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  categories: 'Categorie',
  transactions: 'Transazioni',
};

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
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  pageTitle = computed(() => {
    const segment = this.currentUrl().split('?')[0].split('/').filter(Boolean)[0] ?? '';
    return PAGE_TITLES[segment] ?? '';
  });
}
