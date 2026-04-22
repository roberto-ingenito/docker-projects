import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { TransactionsStore } from '../../core/services/transactions.store';
import { TransactionCard } from './components/transaction-card/transaction-card';
import { Icon } from '../../shared/components/icon/icon';
import { TransactionType } from '../../../lib/types/transaction';
import { AuthStore } from '../../core/services/auth.store';

@Component({
  selector: 'app-transactions',
  imports: [Button, TransactionCard, Icon],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transactions {
  transactionsStore = inject(TransactionsStore);
  authStore = inject(AuthStore);

  userCurrency = computed(() => this.authStore.state()?.user.currency ?? 'EUR');

  statistics = computed(() => {
    const income = this.transactionsStore
      .state()
      ?.filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = this.transactionsStore
      .state()
      ?.filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income: income ?? 0,
      expense: expense ?? 0,
      balance: (income ?? 0) - (expense ?? 0),
    };
  });
}
