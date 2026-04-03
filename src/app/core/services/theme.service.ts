import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  toggle() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  init() {
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.theme.set(preferred);
    document.documentElement.setAttribute('data-theme', preferred);
  }
}
