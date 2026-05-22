import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="lightbox-overlay" (click)="dialogRef.close()">
      <img [src]="data.url" [alt]="data.title || 'Immagine'" (click)="$event.stopPropagation()" />
    </div>
  `,
  styles: [`
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
      z-index: 1000;
    }
    img {
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      border-radius: 8px;
      cursor: default;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    :host ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
        background: transparent !important;
        box-shadow: none !important;
    }
  `]
})
export class ImageLightboxComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageLightboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string; title?: string }
  ) {}
}
