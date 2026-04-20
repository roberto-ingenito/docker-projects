import { inject, Injectable, signal } from '@angular/core';
import { Category } from '../../../lib/types/category';
import { TransactionsApi } from '../../../lib/api/transactions';
import { Transaction } from '../../../lib/types/transaction';

@Injectable({ providedIn: 'root' })
export class TransactionsStore {
  private _state = signal<Transaction[] | null>(null);
  private api = inject(TransactionsApi);

  state = this._state.asReadonly();

  async init() {
    const transactions = await this.api.getTransactions();
    this._state.set(transactions);
  }

  reset = () => this._state.set(null);
}
