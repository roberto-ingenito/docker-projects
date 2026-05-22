import { Component, OnInit, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WarehouseStore } from '../../../core/services/warehouse.store';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent implements OnInit {
  private readonly store = inject(WarehouseStore);

  fadeOut = signal(false);
  showOverlay = signal(true);

  constructor() {
    effect(() => {
      if (this.store.initialized()) {
        // Start fade out
        setTimeout(() => {
          this.fadeOut.set(true);
          // Remove from DOM after transition
          setTimeout(() => {
            this.showOverlay.set(false);
            this.store.hideSplash();
          }, 600);
        }, 1000);
      }
    });
  }

  ngOnInit(): void {
    this.store.init();
  }
}
