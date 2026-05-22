import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService, Article, Shelf, Container } from './api.service';
import { SignalrService } from './signalr.service';

@Injectable({ providedIn: 'root' })
export class WarehouseStore {
  private readonly api = inject(ApiService);
  private readonly signalr = inject(SignalrService);

  // ── State ──────────────────────────────────────────────────────────────────
  private readonly _articles = signal<Article[]>([]);
  private readonly _shelves = signal<Shelf[]>([]);
  private readonly _containers = signal<Container[]>([]);
  private readonly _initialized = signal(false);
  private readonly _splashVisible = signal(true);


  // ── Selectors ──────────────────────────────────────────────────────────────
  readonly articles = this._articles.asReadonly();
  readonly shelves = this._shelves.asReadonly();
  readonly containers = this._containers.asReadonly();
  readonly initialized = this._initialized.asReadonly();
  readonly splashVisible = this._splashVisible.asReadonly();


  // ── Computed ───────────────────────────────────────────────────────────────
  readonly totalArticles = computed(() => this._articles().length);
  readonly totalQuantity = computed(() => this._articles().reduce((sum, a) => sum + a.quantity, 0));
  
  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    if (this._initialized()) return;

    forkJoin({
      articles: this.api.getArticles(),
      shelves: this.api.getShelves(),
      containers: this.api.getContainers()
    }).subscribe({
      next: ({ articles, shelves, containers }) => {
        this._articles.set(articles);
        this._shelves.set(shelves);
        this._containers.set(containers);
        this._initialized.set(true);
      },
      error: (err) => {
        console.error('Failed to initialize WarehouseStore', err);
        // Maybe try again or show error
      }
    });

    this.setupSignalR();
  }

  private setupSignalR() {
    this.signalr.articleAdded$.subscribe(a => this._articles.update(list => [a, ...list]));
    this.signalr.articleUpdated$.subscribe(u => this._articles.update(list => list.map(a => a.id === u.id ? u : a)));
    this.signalr.articleDeleted$.subscribe(({ id }) => this._articles.update(list => list.filter(a => a.id !== id)));
    this.signalr.articleQuantityUpdated$.subscribe(u => this._articles.update(list => list.map(a => a.id === u.id ? u : a)));
    
    // We should add SignalR events for Shelves and Containers in the backend 
    // for true global sync, but for now we update local state on CRUD actions.
  }

  // ── Actions: Local State Synchronization ───────────────────────────────────
  // These help keep the UI snappy before/without full SignalR shelf/container events

  addShelf(s: Shelf) {
    this._shelves.update(list => [...list, s]);
  }
  updateShelf(s: Shelf) {
    this._shelves.update(list => list.map(x => x.id === s.id ? s : x));
  }
  deleteShelf(id: string) {
    this._shelves.update(list => list.filter(x => x.id !== id));
  }

  addContainer(c: Container) {
    this._containers.update(list => [...list, c]);
  }
  updateContainer(c: Container) {
    this._containers.update(list => list.map(x => x.id === c.id ? c : x));
  }
  deleteContainer(id: string) {
    this._containers.update(list => list.filter(x => x.id !== id));
  }
  
  hideSplash() {
    this._splashVisible.set(false);
  }
}

