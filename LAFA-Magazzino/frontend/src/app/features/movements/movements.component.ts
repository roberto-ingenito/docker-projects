import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, signal, inject } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService, Movement } from '../../core/services/api.service';
import { SignalrService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly signalr = inject(SignalrService);
  private readonly destroyRef = inject(DestroyRef);

  movements = signal<Movement[]>([]);
  loading = signal(true);
  filters: {
    articleName: string;
    type: string;
    from: Date | null;
    to: Date | null;
  } = { articleName: '', type: '', from: null, to: null };

  private readonly filterSubject = new Subject<void>();

  ngOnInit(): void {
    this.loadMovements();

    this.signalr.movementAdded$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((m) => {
      this.movements.update((list) => [m, ...list]);
    });

    this.filterSubject.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.loadMovements();
    });
  }

  loadMovements(): void {
    this.loading.set(true);
    const f = this.filters;
    this.api
      .getMovements({
        articleName: f.articleName || undefined,
        type: f.type || undefined,
        from: f.from?.toISOString() || undefined,
        to: f.to?.toISOString() || undefined,
      })
      .subscribe({
        next: (m) => {
          this.movements.set(m);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  applyFilters(): void {
    this.filterSubject.next();
  }

  clearFilters(): void {
    this.filters = { articleName: '', type: '', from: null, to: null };
    this.loadMovements();
  }
}
