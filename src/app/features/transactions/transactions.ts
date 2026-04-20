import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-transactions',
  imports: [Button],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transactions {}
