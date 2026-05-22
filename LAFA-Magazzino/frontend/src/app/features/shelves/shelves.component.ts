import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { WarehouseStore } from '../../core/services/warehouse.store';
import { ApiService, Shelf } from '../../core/services/api.service';
import { ShelfFormDialogComponent } from './shelf-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-shelves',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    RouterLink,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './shelves.component.html',
  styleUrl: './shelves.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelvesComponent {
  readonly store = inject(WarehouseStore);
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  searchQuery = signal('');

  filteredShelves = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.store.shelves();
    return this.store.shelves().filter((s) => s.label.toLowerCase().includes(q));
  });

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  openForm(shelf?: Shelf): void {
    this.dialog.open(ShelfFormDialogComponent, {
      width: '400px',
      data: { shelf },
    });
  }

  deleteShelf(shelf: Shelf): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina Scaffale',
        message: `Sei sicuro di voler eliminare lo scaffale "${shelf.label}"? Verranno eliminati anche i contenitori contenuti.`,
        confirmLabel: 'Elimina',
        confirmColor: 'warn',
      },
    });

    ref
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed && !!shelf.id),
        switchMap(() => this.api.deleteShelf(shelf.id!)),
      )
      .subscribe({
        next: () => {
          this.store.deleteShelf(shelf.id!);
          this.snackBar.open('Scaffale eliminato', 'OK', { duration: 3000 });
        },
      });
  }
}
