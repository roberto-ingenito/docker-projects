import { Component, computed, inject, input } from '@angular/core';
import { Transaction, TransactionType } from '../../../../../lib/types/transaction';
import { Button } from '../../../../shared/components/button/button';
import { Icon } from '../../../../shared/components/icon/icon';
import { CategoriesStore } from '../../../../core/services/categories.store';

@Component({
  selector: 'app-transaction-card',
  imports: [Button, Icon],
  templateUrl: './transaction-card.html',
  styleUrl: './transaction-card.scss',
})
export class TransactionCard {
  categoriesStore = inject(CategoriesStore);

  transaction = input.required<Transaction>();

  category = computed(() =>
    this.categoriesStore //
      .state()
      ?.find((x) => x.categoryId === this.transaction().categoryId),
  );

  isIncome = computed(() => this.transaction().type === TransactionType.Income);

  formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
