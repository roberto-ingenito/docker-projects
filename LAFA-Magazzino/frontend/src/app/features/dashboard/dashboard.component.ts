import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WarehouseStore } from '../../core/services/warehouse.store';
import { ScannerDialogComponent } from '../scanner/scanner-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly store = inject(WarehouseStore);
  private readonly dialog = inject(MatDialog);
  searchQuery = signal('');
  isConnected = true;

  openScanner(): void {
    this.dialog.open(ScannerDialogComponent, {
      maxWidth: '400px',
      width: '90%',
      panelClass: 'custom-dialog-container'
    });
  }

  filteredArticles = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return [];
    return this.store.articles().filter((a) => a.name.toLowerCase().includes(q));
  });

  hasSearch = computed(() => this.searchQuery().trim().length > 0);

  totalArticles = this.store.totalArticles;
  totalQuantity = this.store.totalQuantity;
  lowStockCount = computed(() => this.store.articles().filter((a) => a.quantity > 0 && a.quantity <= 10).length);
  zeroStockCount = computed(() => this.store.articles().filter((a) => a.quantity === 0).length);

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  getQtyClass(quantity: number): string {
    if (quantity === 0) return 'article-quantity qty-red';
    if (quantity <= 10) return 'article-quantity qty-orange';
    return 'article-quantity qty-green';
  }
}
