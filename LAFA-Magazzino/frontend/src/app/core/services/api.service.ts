import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Article {
  id?: string;
  name: string;
  photoUrl?: string;
  notes?: string;
  createdAt?: string;
  stock: ArticleStock[];
  quantity: number;
}

export interface ArticleStock {
  id?: string;
  articleId: string;
  articleName?: string;
  containerId: string;
  containerLabel?: string;
  shelfLabel?: string;
  quantity: number;
}

export interface Shelf {
  id?: string;
  label: string;
  notes?: string;
  createdAt?: string;
  containers: Container[];
}

export interface Container {
  id?: string;
  label: string;
  shelfId: string;
  shelfLabel?: string;
  notes?: string;
  createdAt?: string;
  articles: ArticleStock[];
}

export interface Movement {
  id?: string;
  articleId: string;
  articleName: string;
  type: 'LOAD' | 'UNLOAD';
  quantity: number;
  notes?: string;
  createdAt?: string;
}

export interface ScanActionRequest {
  articleId?: string;
  containerId: string;
  type: 'LOAD' | 'UNLOAD';
  quantity: number;
  notes?: string;
}

export type LookupResult =
  | { type: 'shelf'; data: Shelf }
  | { type: 'container'; data: Container }
  | { type: 'article'; data: Article };

export interface ScanActionResult {
  article: Article;
  movement: Movement;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly base = environment.apiUrl;

  // ── Articles ──────────────────────────────────────────────────────────────

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.base}/articles`);
  }

  searchArticles(q: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.base}/articles/search`, {
      params: new HttpParams().set('q', q),
    });
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.base}/articles/${id}`);
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(`${this.base}/articles`, article);
  }

  updateArticle(id: string, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.base}/articles/${id}`, article);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/articles/${id}`);
  }

  uploadPhoto(id: string, file: File): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ photoUrl: string }>(`${this.base}/articles/${id}/photo`, formData);
  }

  getArticleMovements(id: string): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.base}/articles/${id}/movements`);
  }

  // ── Shelves ───────────────────────────────────────────────────────────────

  getShelves(): Observable<Shelf[]> {
    return this.http.get<Shelf[]>(`${this.base}/shelves`);
  }

  getShelfById(id: string): Observable<Shelf> {
    return this.http.get<Shelf>(`${this.base}/shelves/${id}`);
  }

  createShelf(shelf: Shelf): Observable<Shelf> {
    return this.http.post<Shelf>(`${this.base}/shelves`, shelf);
  }

  updateShelf(id: string, shelf: Shelf): Observable<Shelf> {
    return this.http.put<Shelf>(`${this.base}/shelves/${id}`, shelf);
  }

  deleteShelf(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/shelves/${id}`);
  }

  // ── Containers ────────────────────────────────────────────────────────────

  getContainers(): Observable<Container[]> {
    return this.http.get<Container[]>(`${this.base}/containers`);
  }

  getContainerById(id: string): Observable<Container> {
    return this.http.get<Container>(`${this.base}/containers/${id}`);
  }

  createContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(`${this.base}/containers`, container);
  }

  updateContainer(id: string, container: Container): Observable<Container> {
    return this.http.put<Container>(`${this.base}/containers/${id}`, container);
  }

  deleteContainer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/containers/${id}`);
  }

  // ── Scan ──────────────────────────────────────────────────────────────────

  scanLookup(id: string): Observable<LookupResult> {
    return this.http.get<LookupResult>(`${this.base}/scan/${encodeURIComponent(id)}`);
  }

  scanAction(payload: ScanActionRequest): Observable<ScanActionResult> {
    return this.http.post<ScanActionResult>(`${this.base}/scan/action`, payload);
  }

  // ── Movements ─────────────────────────────────────────────────────────────

  getMovements(filters?: { articleName?: string; type?: string; from?: string; to?: string }): Observable<Movement[]> {
    let params = new HttpParams();
    if (filters?.articleName) params = params.set('articleName', filters.articleName);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    return this.http.get<Movement[]>(`${this.base}/movements`, { params });
  }
}
