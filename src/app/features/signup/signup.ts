import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { Input } from '../../shared/components/input/input';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, Input, Button],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private formBuilder = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  form = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: [''],
    },
    { validators: confirmPasswordValidator },
  );

  error = signal('');

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.authStore.login({
      email,
      password,
    });

    this.router.navigate(['/dashboard']);
  }
}

const confirmPasswordValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword');

  if (password !== confirmPassword?.value) {
    confirmPassword?.setErrors({ passwordMismatch: true });
  } else {
    confirmPassword?.setErrors(null);
  }

  return null;
};
