import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ApiService, Article, ArticleStock } from '../../core/services/api.service';
import { WarehouseStore } from '../../core/services/warehouse.store';

export interface ArticleFormData {
  mode: 'add' | 'edit';
  article?: Article;
}

@Component({
  selector: 'app-article-form-dialog',
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
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './article-form-dialog.component.html',
  styleUrl: './article-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  readonly store = inject(WarehouseStore);
  dialogRef = inject<MatDialogRef<ArticleFormDialogComponent>>(MatDialogRef);
  data = inject<ArticleFormData>(MAT_DIALOG_DATA);

  form!: FormGroup;
  saving = false;
  photoPreview: string | null = null;
  selectedFile: File | null = null;

  ngOnInit() {
    const a = this.data.article;
    this.form = this.fb.group({
      name: [a?.name ?? '', Validators.required],
      notes: [a?.notes ?? ''],
      stock: this.fb.array([]),
      photoUrl: [a?.photoUrl ?? ''],
    });

    if (a?.stock && a.stock.length > 0) {
      a.stock.forEach((s) => this.addStock(s));
    } else {
      this.addStock(); // aggiungi almeno una riga vuota
    }
  }

  get stock(): FormArray {
    return this.form.get('stock') as FormArray;
  }

  addStock(s?: Partial<ArticleStock>): void {
    const group = this.fb.group({
      containerId: [s?.containerId ?? '', Validators.required],
      quantity: [s?.quantity ?? 0, [Validators.required, Validators.min(0)]],
    });
    this.stock.push(group);
  }

  removeStock(index: number) {
    if (this.stock.length > 1) {
      this.stock.removeAt(index);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setPhoto(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.setPhoto(file);
  }

  setPhoto(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.photoPreview = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
    this.selectedFile = null;
    this.form.patchValue({ photoUrl: '' });
  }

  async submit() {
    if (this.form.invalid) return;
    this.saving = true;

    const dto: Article = {
      ...this.form.value,
      id: this.data.article?.id,
    };

    try {
      let saved: Article;

      if (this.data.mode === 'add') {
        saved = (await this.api.createArticle(dto).toPromise()) as Article;
      } else {
        saved = (await this.api.updateArticle(dto.id!, dto).toPromise()) as Article;
      }

      // Upload photo if selected
      if (this.selectedFile && saved.id) {
        try {
          await this.api.uploadPhoto(saved.id, this.selectedFile).toPromise();
        } catch {
          this.snackBar.open('⚠ Articolo salvato ma errore caricamento foto', 'OK');
        }
      }

      this.dialogRef.close(saved);
    } catch (err: unknown) {
      const apiError = err as { error?: { message?: string } };
      const msg = apiError?.error?.message ?? 'Errore durante il salvataggio';
      this.snackBar.open(`✗ ${msg}`, 'Chiudi', {
        panelClass: 'snack-error',
      });
    } finally {
      this.saving = false;
    }
  }
}
