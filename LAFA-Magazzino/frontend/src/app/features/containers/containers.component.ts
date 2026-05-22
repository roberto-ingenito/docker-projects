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
import { ApiService, Container } from '../../core/services/api.service';
import { ContainerFormDialogComponent } from './container-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-containers',
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
  templateUrl: './containers.component.html',
  styleUrl: './containers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainersComponent {
  readonly store = inject(WarehouseStore);
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  searchQuery = signal('');

  filteredContainers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.store.containers();
    return this.store.containers().filter((c) => c.label.toLowerCase().includes(q));
  });

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  openForm(container?: Container): void {
    this.dialog.open(ContainerFormDialogComponent, {
      width: '400px',
      data: { container },
    });
  }

  deleteContainer(container: Container): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina Contenitore',
        message: `Sei sicuro di voler eliminare il contenitore "${container.label}"? Gli articoli rimarranno nel sistema ma perderanno questa posizione.`,
        confirmLabel: 'Elimina',
        confirmColor: 'warn',
      },
    });

    ref
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed && !!container.id),
        switchMap(() => this.api.deleteContainer(container.id!)),
      )
      .subscribe({
        next: () => {
          this.store.deleteContainer(container.id!);
          this.snackBar.open('Contenitore eliminato', 'OK', { duration: 3000 });
        },
      });
  }
}
