import { inject, Injectable, signal } from '@angular/core';
import { Category } from '../../../lib/types/category';
import { CategoriesApi } from '../../../lib/api/categories';

type Categories = Omit<Category, 'userId'>[];

@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private _state = signal<Categories | null>(null);
  private api = inject(CategoriesApi);

  state = this._state.asReadonly();

  async init() {
    const categories = await this.api.getCategories();

    this._state.set(
      categories.sort((a, b) =>
        a.categoryName.toLowerCase().localeCompare(b.categoryName.toLocaleLowerCase()),
      ),
    );
  }

  reset = () => this._state.set(null);
}
