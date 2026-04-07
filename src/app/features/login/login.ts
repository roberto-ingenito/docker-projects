import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { Input } from '../../shared/components/input/input';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Input, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  error = signal('');

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    try {
      await this.authStore.login({
        email: email,
        password: password,
      });
      this.router.navigate(['/dashboard']);
    } catch (error) {}
  }
}
