import { Component, ChangeDetectionStrategy, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Router } from '@angular/router';
import { ApiService, LookupResult } from '../../core/services/api.service';

type ScanState = 'ready' | 'loading' | 'not-found';

@Component({
  selector: 'app-scanner-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ZXingScannerModule,
  ],
  template: `
    <div class="scanner-dialog">
      <div class="dialog-header">
        <h2>Scannerizza QR Code</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="camera-selector" *ngIf="availableDevices.length > 1">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fotocamera</mat-label>
            <mat-select
              [value]="currentDevice?.deviceId"
              (selectionChange)="onDeviceSelectChange($event.value)"
            >
              <mat-option *ngFor="let device of availableDevices" [value]="device.deviceId">
                {{ device.label || 'Video ' + device.deviceId.substring(0, 5) }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="camera-container">
          <zxing-scanner
            [enable]="cameraEnabled"
            [device]="currentDevice"
            (scanSuccess)="onScanSuccess($event)"
            (scanError)="onScanError($event)"
            (camerasFound)="onCamerasFound($event)"
            (camerasNotFound)="onCamerasNotFound($event)"
            (permissionResponse)="onPermissionResponse($event)"
            [formats]="scanFormats"
          ></zxing-scanner>
          
          <div class="scanner-overlay">
            <div class="scan-frame"></div>
            <div class="scan-hint">Inquadra il codice QR nel quadrato</div>
          </div>

          <div class="loading-overlay" *ngIf="state() === 'loading'">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Ricerca...</p>
          </div>

          <div class="error-overlay" *ngIf="state() === 'not-found'">
            <mat-icon>error_outline</mat-icon>
            <p>Codice non valido</p>
            <button mat-stroked-button color="warn" (click)="reset()">Riprova</button>
          </div>
        </div>

        <div class="manual-input">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Inserisci manualmente</mat-label>
            <input
              matInput
              [(ngModel)]="manualCode"
              (keyup.enter)="onManualScan()"
              placeholder="Esempio: ART-001"
              autocomplete="off"
            />
            <button mat-icon-button matSuffix (click)="onManualScan()" [disabled]="!manualCode.trim()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scanner-dialog {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      background: var(--surface);
      border-radius: 24px;
      overflow: hidden;
    }

    .dialog-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);

      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
      }
    }

    .dialog-content {
      padding: 20px;
    }

    .camera-container {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      background: #000;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    zxing-scanner {
      width: 100%;
      height: 100%;
    }

    .scanner-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .scan-frame {
      width: 200px;
      height: 200px;
      border: 3px solid var(--accent);
      border-radius: 24px;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
      animation: frame-pulse 2s ease-in-out infinite;
    }

    @keyframes frame-pulse {
      0%, 100% { border-color: var(--accent); opacity: 0.8; }
      50% { border-color: var(--accent-dim); opacity: 1; }
    }

    .scan-hint {
      color: white;
      font-size: 12px;
      margin-top: 16px;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 12px;
      backdrop-filter: blur(4px);
    }

    .loading-overlay, .error-overlay {
      position: absolute;
      inset: 0;
      background: rgba(var(--surface-rgb), 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 10;
      backdrop-filter: blur(8px);
    }

    .error-overlay {
      color: var(--qty-red);
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      p { margin: 0; font-weight: 600; }
    }

    .full-width {
      width: 100%;
    }

    .camera-selector {
      margin-bottom: 8px;
    }

    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      border-radius: 24px !important;
      padding: 0 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerDialogComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<ScannerDialogComponent>);

  state = signal<ScanState>('ready');
  cameraEnabled = true;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  manualCode = '';
  
  readonly scanFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  private scanCooldown = false;

  ngOnInit(): void {
    // Permission and camera handled by zxing-scanner component
  }

  ngOnDestroy(): void {
    this.cameraEnabled = false;
  }

  close(): void {
    this.dialogRef.close();
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    if (devices.length > 0 && !this.currentDevice) {
      // Try to find back camera
      const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('posteriore'));
      this.currentDevice = backCamera || devices[0];
    }
  }

  onCamerasNotFound(error: any): void {
    console.error('Cameras not found', error);
    this.snackBar.open('Nessuna fotocamera trovata.', 'Chiudi', { duration: 3000 });
  }

  onDeviceSelectChange(deviceId: string): void {
    const device = this.availableDevices.find(d => d.deviceId === deviceId);
    if (device) this.currentDevice = device;
  }

  onPermissionResponse(hasPermission: boolean): void {
    if (!hasPermission) {
      this.snackBar.open('Permesso fotocamera negato.', 'Chiudi', { duration: 3000 });
      this.close();
    }
  }

  onScanError(error: any): void {
    console.error('Scan error', error);
  }

  onScanSuccess(code: string): void {
    if (this.scanCooldown) return;
    this.scanCooldown = true;
    setTimeout(() => (this.scanCooldown = false), 2000);

    try {
      const parsed = JSON.parse(code);
      if (parsed.type && parsed.id) {
        this.navigateByType(parsed.type, parsed.id);
        return;
      }
    } catch {
      this.lookupAny(code);
    }
  }

  onManualScan(): void {
    const code = this.manualCode.trim();
    if (!code) return;
    this.lookupAny(code);
  }

  private navigateByType(type: string, id: string) {
    this.close();
    switch (type) {
      case 'shelf':
        this.router.navigate(['/shelves', id]);
        break;
      case 'container':
        this.router.navigate(['/containers', id]);
        break;
      case 'article':
        this.router.navigate(['/articles', id]);
        break;
      default:
        this.snackBar.open('Tipo sconosciuto: ' + type, 'Chiudi', { duration: 3000 });
    }
  }

  private lookupAny(id: string) {
    this.state.set('loading');
    this.api.scanLookup(id).subscribe({
      next: (result: LookupResult) => {
        this.navigateByType(result.type, result.data.id!);
      },
      error: () => {
        this.state.set('not-found');
        setTimeout(() => this.state.set('ready'), 3000);
      },
    });
  }

  reset(): void {
    this.state.set('ready');
    this.manualCode = '';
  }
}
