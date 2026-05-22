import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Article, Movement } from './api.service';

@Injectable({ providedIn: 'root' })
export class SignalrService implements OnDestroy {
  private hubConnection!: signalR.HubConnection;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly _articleQuantityUpdated = new Subject<Article>();
  private readonly _movementAdded = new Subject<Movement>();
  private readonly _articleAdded = new Subject<Article>();
  private readonly _articleUpdated = new Subject<Article>();
  private readonly _articleDeleted = new Subject<{ id: string }>();

  readonly articleQuantityUpdated$: Observable<Article> = this._articleQuantityUpdated.asObservable();
  readonly movementAdded$: Observable<Movement> = this._movementAdded.asObservable();
  readonly articleAdded$: Observable<Article> = this._articleAdded.asObservable();
  readonly articleUpdated$: Observable<Article> = this._articleUpdated.asObservable();
  readonly articleDeleted$: Observable<{ id: string }> = this._articleDeleted.asObservable();

  connect(): void {
    if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalrUrl, {
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hubConnection.on('ArticleQuantityUpdated', (article: Article) => {
      this._articleQuantityUpdated.next(article);
    });

    this.hubConnection.on('MovementAdded', (movement: Movement) => {
      this._movementAdded.next(movement);
    });

    this.hubConnection.on('ArticleAdded', (article: Article) => {
      this._articleAdded.next(article);
    });

    this.hubConnection.on('ArticleUpdated', (article: Article) => {
      this._articleUpdated.next(article);
    });

    this.hubConnection.on('ArticleDeleted', (data: { id: string }) => {
      this._articleDeleted.next(data);
    });

    this.hubConnection.onclose(() => {
      console.warn('[SignalR] Connection closed. Reconnecting...');
      this.scheduleReconnect();
    });

    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.info('[SignalR] Connected'))
      .catch((err) => {
        console.error('[SignalR] Connection error:', err);
        this.scheduleReconnect();
      });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.startConnection(), 5000);
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.hubConnection?.stop().catch(console.error);
  }

  ngOnDestroy(): void {
    this.disconnect();
    this._articleQuantityUpdated.complete();
    this._movementAdded.complete();
    this._articleAdded.complete();
    this._articleUpdated.complete();
    this._articleDeleted.complete();
  }
}
