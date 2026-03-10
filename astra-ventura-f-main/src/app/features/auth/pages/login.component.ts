import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;

  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authApi: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });

    // Captura la URL de retorno del guard, o redirige a home por defecto
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = null;

    this.authApi.login({
      email: this.email.value,
      password: this.password.value
    }).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.loading = false;

        if (err.status === 0) {
          this.error = 'Unable to connect to server. Check your network or CORS configuration.';
        } else if (err.status === 401) {
          this.error = err?.error?.message ?? 'Invalid credentials. Check your email and password.';
        } else {
          this.error = err?.error?.message ?? `Server error (${err.status}). Try again later.`;
        }
      }
    });
  }
}
