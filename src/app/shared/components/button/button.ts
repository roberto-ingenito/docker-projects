import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'outlined'>('primary');
  icon = input<string>();
  disabled = input(false);
  clicked = output<void>();
}
