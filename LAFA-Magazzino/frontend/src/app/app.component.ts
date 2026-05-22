import { Component, OnInit, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SignalrService } from './core/services/signalr.service';
import { WarehouseStore } from './core/services/warehouse.store';
import { ScannerDialogComponent } from './features/scanner/scanner-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly signalrService = inject(SignalrService);
  private readonly store = inject(WarehouseStore);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);

  showNav = computed(() => !this.store.splashVisible());

  // Use BreakpointObserver to detect if we are on mobile
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  sidenavOpen = signal(false);

  ngOnInit() {
    // Start SignalR connection
    this.signalrService.connect();
  }

  toggleSidenav() {
    this.sidenavOpen.update((v) => !v);
  }

  closeSidenavOnMobile() {
    if (this.isMobile()) {
      this.sidenavOpen.set(false);
    }
  }

  openScanner(): void {
    this.dialog.open(ScannerDialogComponent, {
      maxWidth: '400px',
      width: '90%',
      panelClass: 'custom-dialog-container'
    });
  }
}
