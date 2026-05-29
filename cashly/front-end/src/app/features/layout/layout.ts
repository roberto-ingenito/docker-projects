import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ThemeService } from '../../core/services/theme.service';
import { AuthStore } from '../../core/services/auth.store';
import { CategoriesStore } from '../../core/services/categories.store';
import { TransactionsStore } from '../../core/services/transactions.store';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatIconButton,
    MatTooltipModule,
    MatProgressSpinner,
    Icon,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthStore);
  private categoriesStore = inject(CategoriesStore);
  private transactionsStore = inject(TransactionsStore);
  protected themeService = inject(ThemeService);

  protected readonly navItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'categories', label: 'Categorie', icon: 'category' },
    { route: 'transactions', label: 'Transazioni', icon: 'receipt_long' },
  ];

  isDark = computed(() => this.themeService.theme() === 'dark');

  isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.categoriesStore.init(),
      this.transactionsStore.init(),
    ]);

    this.isLoading.set(false);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
