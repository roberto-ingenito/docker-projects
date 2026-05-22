import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Clipboard } from '@angular/cdk/clipboard';
import { switchMap, filter } from 'rxjs';
import { ApiService, Article, Movement } from '../../core/services/api.service';
import { SignalrService } from '../../core/services/signalr.service';
import { QrService } from '../../core/services/qr.service';
import { ArticleFormDialogComponent } from '../articles/article-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ImageLightboxComponent } from '../../shared/components/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly signalr = inject(SignalrService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly qrService = inject(QrService);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly clipboard = inject(Clipboard);

  article = signal<Article | null>(null);
  movements = signal<Movement[]>([]);
  loading = signal(true);
  qrCodeUrl = signal('');

  // Load/Unload form
  movementType = signal<'LOAD' | 'UNLOAD'>('LOAD');
  movementContainerId = signal('');
  movementQuantity = signal(1);
  movementNotes = signal('');
  movementSaving = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);

    this.signalr.articleUpdated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updated) => {
      if (this.article()?.id === updated.id) {
        this.article.set(updated);
      }
    });

    this.signalr.articleQuantityUpdated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updated) => {
      if (this.article()?.id === updated.id) {
        this.article.set(updated);
      }
    });

    this.signalr.articleDeleted$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ id: deletedId }) => {
      if (this.article()?.id === deletedId) {
        this.snackBar.open('Questo articolo è stato eliminato', 'OK', {
          panelClass: 'snack-error',
        });
        this.router.navigate(['/articles']);
      }
    });

    this.signalr.movementAdded$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((movement) => {
      if (this.article()?.id === movement.articleId) {
        this.movements.update((list) => [movement, ...list]);
      }
    });
  }

  load(id: string): void {
    this.loading.set(true);
    this.api.getArticleById(id).subscribe({
      next: (a) => {
        this.article.set(a);
        this.loading.set(false);
        this.loadMovements(id);
        this.generateQr();
        // Pre-select first container if available
        if (a.stock.length > 0) {
          this.movementContainerId.set(a.stock[0].containerId);
        }
      },
      error: () => {
        this.article.set(null);
        this.loading.set(false);
      },
    });
  }

  async generateQr(): Promise<void> {
    const art = this.article();
    if (art) {
      this.qrCodeUrl.set(await this.qrService.generateQrCode(this.getQrValue()));
    }
  }

  getQrValue() {
    const art = this.article();
    if (!art) return '';
    return JSON.stringify({ type: 'article', id: art.id });
  }

  printLabel(mode: 'inline' | 'stacked'): void {
    const art = this.article();
    if (this.qrCodeUrl() && art) {
      this.qrService.printLabel(this.qrCodeUrl(), art.name, mode);
    }
  }

  loadMovements(id: string): void {
    this.api.getArticleMovements(id).subscribe({
      next: (m) => this.movements.set(m),
      error: () => {},
    });
  }

  openEdit(): void {
    const ref = this.dialog.open(ArticleFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { mode: 'edit', article: this.article() },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.article.set(result);
        this.snackBar.open('✓ Articolo aggiornato', 'OK', { panelClass: 'snack-success' });
      }
    });
  }

  confirmDelete(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina Articolo',
        message: `Sei sicuro di voler eliminare "${this.article()?.name}"?`,
        confirmLabel: 'Elimina',
        confirmColor: 'warn',
      },
    });
    ref
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.api.deleteArticle(this.article()!.id!)),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('✓ Articolo eliminato', 'OK', { panelClass: 'snack-success' });
          this.router.navigate(['/articles']);
        },
        error: () => {
          this.snackBar.open('✗ Errore durante la cancellazione', 'Chiudi', {
            panelClass: 'snack-error',
          });
        },
      });
  }

  onPhotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.article()?.id) return;

    this.api.uploadPhoto(this.article()!.id!, file).subscribe({
      next: ({ photoUrl }) => {
        this.article.update((a) => (a ? { ...a, photoUrl } : a));
        this.snackBar.open('✓ Foto aggiornata', 'OK', { panelClass: 'snack-success' });
      },
      error: () => {
        this.snackBar.open('✗ Errore caricamento foto', 'Chiudi', { panelClass: 'snack-error' });
      },
    });
  }

  openPhoto(): void {
    const url = this.article()?.photoUrl;
    if (url) {
      this.dialog.open(ImageLightboxComponent, {
        data: { url, title: this.article()?.name },
        panelClass: 'lightbox-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });
    }
  }

  openQrLightbox(): void {
    const url = this.qrCodeUrl();
    if (url) {
      this.dialog.open(ImageLightboxComponent, {
        data: { url, title: 'QR Code' },
        panelClass: 'lightbox-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });
    }
  }

  copyId(): void {
    const id = this.article()?.id;
    if (id) {
      this.clipboard.copy(id);
      this.snackBar.open('✓ ID copiato negli appunti', 'OK', { duration: 2000, panelClass: 'snack-success' });
    }
  }

  getQtyClass(qty: number): string {
    if (qty === 0) return 'quantity-display qty-red';
    if (qty <= 10) return 'quantity-display qty-orange';
    return 'quantity-display qty-green';
  }

  getQrJson() {
    const art = this.article();
    if (!art) return '';
    return JSON.stringify({ type: 'article', id: art.id }, null, 2);
  }

  goBack(): void {
    this.location.back();
  }

  submitMovement(): void {
    const art = this.article();
    if (!art?.id || !this.movementContainerId()) return;

    this.movementSaving.set(true);

    this.api
      .scanAction({
        articleId: art.id,
        containerId: this.movementContainerId(),
        type: this.movementType(),
        quantity: this.movementQuantity(),
        notes: this.movementNotes() || undefined,
      })
      .subscribe({
        next: (result) => {
          this.article.set(result.article);
          this.snackBar.open(
            `✓ ${this.movementType() === 'LOAD' ? 'Carico' : 'Scarico'} registrato`,
            'OK',
            { panelClass: 'snack-success' },
          );
          this.movementQuantity.set(1);
          this.movementNotes.set('');
          this.movementSaving.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Errore durante il movimento';
          this.snackBar.open(`✗ ${msg}`, 'Chiudi', { panelClass: 'snack-error' });
          this.movementSaving.set(false);
        },
      });
  }
}
