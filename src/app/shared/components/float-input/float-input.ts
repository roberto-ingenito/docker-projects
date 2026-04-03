import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
  forwardRef,
  model,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'app-float-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatInput),
      multi: true,
    },
  ],
  templateUrl: './float-input.html',
  styleUrl: './float-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatInput {
  label = input.required<string>();
  disabled = model<boolean>(false);
  type = input<HTMLInputElement['type']>('text');
  autocomplete = input<HTMLInputElement['autocomplete']>('off');

  inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  focused = signal(false);
  filled = signal(false);

  inputId = `float-input-${nextId++}`;
  errorId = `${this.inputId}-error`;

  private onChange(value: string): void {}

  private onTouched(): void {}

  writeValue(value: string): void {
    const el = this.inputEl()?.nativeElement;
    if (el) {
      el.value = value ?? '';
    }
    this.filled.set(!!value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filled.set(!!value);
    this.onChange(value);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }
}
