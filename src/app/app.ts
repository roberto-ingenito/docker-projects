import { afterNextRender, Component, effect, inject, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from './core/services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  template: '<router-outlet /><ngx-sonner-toaster position="bottom-right" />',
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
    this.markIconsReadyWhenFontLoaded();
  }

  private markIconsReadyWhenFontLoaded(): void {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) {
      document.documentElement.classList.add('icons-ready');
      return;
    }
    fonts.load("24px 'Material Symbols Rounded Variable'").finally(() => {
      document.documentElement.classList.add('icons-ready');
    });
  }

  private removeNoTransitions(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('no-transitions');
      });
    });
  }
}
