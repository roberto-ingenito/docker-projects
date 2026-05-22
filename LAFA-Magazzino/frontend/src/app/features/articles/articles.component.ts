import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { switchMap, filter } from 'rxjs';
import { ApiService, Article } from '../../core/services/api.service';
import { WarehouseStore } from '../../core/services/warehouse.store';
import { ArticleFormDialogComponent } from './article-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ImageLightboxComponent } from '../../shared/components/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly store = inject(WarehouseStore);
  searchQuery = signal('');
  loading = signal(true);

  displayArticles = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.store.articles();
    return this.store.articles().filter((a) => a.name.toLowerCase().includes(q));
  });

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  openAddDialog() {
    const ref = this.dialog.open(ArticleFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { mode: 'add' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('✓ Articolo aggiunto', 'OK', { panelClass: 'snack-success' });
      }
    });
  }

  openEditDialog(article: Article) {
    const ref = this.dialog.open(ArticleFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { mode: 'edit', article },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('✓ Articolo aggiornato', 'OK', { panelClass: 'snack-success' });
      }
    });
  }

  confirmDelete(article: Article) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina Articolo',
        message: `Sei sicuro di voler eliminare "${article.name}"? Questa azione è irreversibile.`,
        confirmLabel: 'Elimina',
        confirmColor: 'warn',
      },
    });

    ref
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.api.deleteArticle(article.id!)),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('✓ Articolo eliminato', 'OK', { panelClass: 'snack-success' });
        },
        error: () => {
          this.snackBar.open("✗ Errore durante l'eliminazione", 'Chiudi', { panelClass: 'snack-error' });
        },
      });
  }

  openPhoto(url: string | undefined | null, event: Event): void {
    event.stopPropagation();
    if (url) {
      this.dialog.open(ImageLightboxComponent, {
        data: { url },
        panelClass: 'lightbox-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });
    }
  }

  getQtyClass(qty: number): string {
    if (qty === 0) return 'article-quantity qty-red';
    if (qty <= 10) return 'article-quantity qty-orange';
    return 'article-quantity qty-green';
  }
}
