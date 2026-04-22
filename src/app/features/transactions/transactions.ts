import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { TransactionsStore } from '../../core/services/transactions.store';
import { TransactionCard } from './components/transaction-card/transaction-card';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-transactions',
  imports: [Button, TransactionCard, Icon],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transactions {
  transactionsStore = inject(TransactionsStore);
}
