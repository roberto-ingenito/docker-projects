import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Shelf } from '../../../core/services/api.service';
import { filter, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { QrService } from '../../../core/services/qr.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ShelfFormDialogComponent } from '../shelf-form-dialog.component';
import { ImageLightboxComponent } from '../../../shared/components/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-shelf-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './shelf-detail.component.html',
  styleUrl: './shelf-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly qrService = inject(QrService);
  private readonly location = inject(Location);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

  shelf = signal<Shelf | undefined>(undefined);
  loading = signal(true);
  qrCodeUrl = signal('');

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadShelf(id);
      }
    });
  }

  loadShelf(id: string): void {
    this.api.getShelfById(id).subscribe({
      next: (data) => {
        this.shelf.set(data);
        this.loading.set(false);
        this.generateQr();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  async generateQr(): Promise<void> {
    if (this.shelf()) {
      this.qrCodeUrl.set(await this.qrService.generateQrCode(this.getQrValue()));
    }
  }

  getQrValue(): string {
    if (!this.shelf()) return '';
    return JSON.stringify({ type: 'shelf', id: this.shelf()!.id });
  }

  printLabel(mode: 'inline' | 'stacked'): void {
    if (this.qrCodeUrl() && this.shelf()) {
      this.qrService.printLabel(this.qrCodeUrl(), this.shelf()!.label, mode);
    }
  }

  getQrJson(): string {
    if (!this.shelf()) return '';
    return JSON.stringify({ type: 'shelf', id: this.shelf()!.id }, null, 2);
  }

  goBack(): void {
    this.location.back();
  }

  copyId(): void {
    const id = this.shelf()?.id;
    if (id) {
      this.clipboard.copy(id);
      this.snackBar.open('✓ ID copiato negli appunti', 'OK', { duration: 2000, panelClass: 'snack-success' });
    }
  }

  openEdit(): void {
    if (!this.shelf()) return;
    const dialogRef = this.dialog.open(ShelfFormDialogComponent, {
      data: { shelf: this.shelf() },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadShelf(this.shelf()!.id!);
      }
    });
  }

  confirmDelete(): void {
    if (!this.shelf()) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina Scaffale',
        message: `Sei sicuro di voler eliminare lo scaffale "${this.shelf()!.label}"? Tutti i contenitori verranno dissociati.`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap(() => this.api.deleteShelf(this.shelf()!.id!)),
      )
      .subscribe(() => {
        this.router.navigate(['/shelves']);
      });
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
}
