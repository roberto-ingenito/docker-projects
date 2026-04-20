import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'material-symbols-rounded',
    'aria-hidden': 'true',
    '[style.font-size.px]': 'size()',
    '[style.font-variation-settings]': 'variationSettings()',
  },
})
export class Icon {
  size = input<number>(24);
  filled = input<boolean>(true);

  protected variationSettings = computed(
    () => `'FILL' ${this.filled() ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${this.size()}`,
  );
}
