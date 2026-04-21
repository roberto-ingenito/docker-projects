import { Component, computed, input } from '@angular/core';
import { Transaction, TransactionType } from '../../../../../lib/types/transaction';
import { Button } from '../../../../shared/components/button/button';
import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-transaction-card',
  imports: [Button, Icon],
  templateUrl: './transaction-card.html',
  styleUrl: './transaction-card.scss',
})
export class TransactionCard {
  transaction = input.required<Transaction>();

  isIncome = computed(() => this.transaction().type === TransactionType.Income);
}
