import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Container } from '../../../core/services/api.service';
import { filter, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { QrService } from '../../../core/services/qr.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ContainerFormDialogComponent } from '../container-form-dialog.component';
import { ImageLightboxComponent } from '../../../shared/components/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-container-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './container-detail.component.html',
  styleUrl: './container-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly qrService = inject(QrService);
  private readonly location = inject(Location);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

  container = signal<Container | undefined>(undefined);
  loading = signal(true);
  qrCodeUrl = signal('');

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadContainer(id);
      }
    });
  }

  loadContainer(id: string): void {
    this.api.getContainerById(id).subscribe({
      next: (data) => {
        this.container.set(data);
        this.loading.set(false);
        this.generateQr();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  async generateQr(): Promise<void> {
    if (this.container()) {
      this.qrCodeUrl.set(await this.qrService.generateQrCode(this.getQrValue()));
    }
  }

  getQrValue(): string {
    if (!this.container()) return '';
    return JSON.stringify({ type: 'container', id: this.container()!.id });
  }

  printLabel(mode: 'inline' | 'stacked'): void {
    if (this.qrCodeUrl() && this.container()) {
      this.qrService.printLabel(this.qrCodeUrl(), this.container()!.label, mode);
    }
  }

  getQrJson(): string {
    if (!this.container()) return '';
    return JSON.stringify({ type: 'container', id: this.container()!.id }, null, 2);
  }

  goBack(): void {
    this.location.back();
  }

  copyId(): void {
    const id = this.container()?.id;
    if (id) {
      this.clipboard.copy(id);
      this.snackBar.open('✓ ID copiato negli appunti', 'OK', { duration: 2000, panelClass: 'snack-success' });
    }
  }

  openEdit(): void {
    if (!this.container()) return;
    const dialogRef = this.dialog.open(ContainerFormDialogComponent, {
      data: { container: this.container() },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadContainer(this.container()!.id!);
      }
    });
  }

  confirmDelete(): void {
    if (!this.container()) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina Contenitore',
        message: `Sei sicuro di voler eliminare il contenitore "${this.container()!.label}"?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap(() => this.api.deleteContainer(this.container()!.id!)),
      )
      .subscribe(() => {
        this.router.navigate(['/containers']);
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
