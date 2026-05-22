import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService, Shelf } from '../../core/services/api.service';
import { WarehouseStore } from '../../core/services/warehouse.store';

@Component({
  selector: 'app-shelf-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './shelf-form-dialog.component.html',
  styleUrl: './shelf-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly store = inject(WarehouseStore);
  private readonly dialogRef = inject(MatDialogRef<ShelfFormDialogComponent>);
  readonly data = inject<{ shelf?: Shelf }>(MAT_DIALOG_DATA);

  form!: FormGroup;
  saving = false;

  ngOnInit() {
    this.form = this.fb.group({
      label: [this.data.shelf?.label ?? '', Validators.required],
      notes: [this.data.shelf?.notes ?? ''],
    });
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;

    const shelf: Shelf = {
      ...this.data.shelf,
      label: this.form.value.label,
      notes: this.form.value.notes || undefined,
      containers: this.data.shelf?.containers ?? [],
    };

    const action = shelf.id ? this.api.updateShelf(shelf.id, shelf) : this.api.createShelf(shelf);

    action.subscribe({
      next: (res) => {
        if (shelf.id) this.store.updateShelf(res);
        else this.store.addShelf(res);
        this.dialogRef.close(res);
      },
      error: () => (this.saving = false),
    });
  }
}
