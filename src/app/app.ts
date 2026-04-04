import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { ThemeService } from './core/services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private theme = inject(ThemeService);
  private router = inject(Router);

  constructor() {
    // Primo caricamento: rimuove la classe dopo che Angular ha renderizzato
    afterNextRender(() => {
      this.removeNoTransitions();
    });

    // Navigazioni successive: re-aggiunge la classe a ogni cambio route
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        document.body.classList.add('no-transitions');
      });

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.removeNoTransitions();
      });
  }

  ngOnInit() {
    this.theme.init();
  }

  private removeNoTransitions(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('no-transitions');
      });
    });
  }
}
