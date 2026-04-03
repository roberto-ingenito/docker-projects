import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { FloatInput } from '../../shared/components/float-input/float-input';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FloatInput],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error = signal('');

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();

    this.auth.login({
      id: crypto.randomUUID(),
      email,
    });

    this.router.navigate(['/dashboard']);
  }
}
