import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-recover-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {

  form: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authApi: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    }, { validators: this.emailMatchValidator });
  }

  get email() { return this.form.get('email')!; }
  get confirmEmail() { return this.form.get('confirmEmail')!; }

  emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email');
    const confirmEmail = control.get('confirmEmail');

    if (email && confirmEmail && email.value !== confirmEmail.value) {
      return { emailMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.authApi.recoverPassword({
      email: this.email.value
    }).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: err => {
        this.loading = false;
        
        if (err.status === 429) {
          this.error = 'Too many requests. Please try again in 2 hours.';
        } else {
          this.error = err.error?.message || err.message || 'An error occurred. Please try again later.';
        }
      }
    });
  }
}
