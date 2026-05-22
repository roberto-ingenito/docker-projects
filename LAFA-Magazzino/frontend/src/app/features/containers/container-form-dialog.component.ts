import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService, Container } from '../../core/services/api.service';
import { WarehouseStore } from '../../core/services/warehouse.store';

@Component({
  selector: 'app-container-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.container ? 'Modifica Contenitore' : 'Nuovo Contenitore' }}</h2>
      <mat-dialog-content>
        <form [formGroup]="form" class="container-form">
          <mat-form-field class="full-width">
            <mat-label>Nome Contenitore</mat-label>
            <mat-icon matPrefix>label</mat-icon>
            <input matInput formControlName="label" placeholder="Es. Scatola Blu, Cassetto 1..." />
            @if (form.get('label')?.hasError('required')) {
              <mat-error>Il nome è obbligatorio</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Scaffale</mat-label>
            <mat-icon matPrefix>dns</mat-icon>
            <mat-select formControlName="shelfId">
              @for (shelf of store.shelves(); track shelf.id) {
                <mat-option [value]="shelf.id">{{ shelf.label }}</mat-option>
              }
            </mat-select>
            @if (form.get('shelfId')?.hasError('required')) {
              <mat-error>Lo scaffale è obbligatorio</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Note</mat-label>
            <mat-icon matPrefix>notes</mat-icon>
            <textarea matInput formControlName="notes" placeholder="Note opzionali..." rows="3"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Annulla</button>
        <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
          @if (saving) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            {{ data.container ? 'Aggiorna' : 'Crea' }}
          }
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 8px;
      }
      .container-form {
        margin-top: 16px;
        min-width: 300px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  readonly store = inject(WarehouseStore);
  private readonly dialogRef = inject(MatDialogRef<ContainerFormDialogComponent>);
  readonly data = inject<{ container?: Container }>(MAT_DIALOG_DATA);

  form!: FormGroup;
  saving = false;

  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.container?.label ?? '', Validators.required],
      shelfId: [this.data.container?.shelfId ?? '', Validators.required],
      notes: [this.data.container?.notes ?? ''],
    });
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;

    const container: Container = {
      ...this.data.container,
      label: this.form.value.label,
      shelfId: this.form.value.shelfId,
      notes: this.form.value.notes || undefined,
      articles: this.data.container?.articles ?? [],
    };

    const action = container.id
      ? this.api.updateContainer(container.id, container)
      : this.api.createContainer(container);

    action.subscribe({
      next: (res) => {
        if (container.id) this.store.updateContainer(res);
        else this.store.addContainer(res);
        this.dialogRef.close(res);
      },
      error: () => (this.saving = false),
    });
  }
}
