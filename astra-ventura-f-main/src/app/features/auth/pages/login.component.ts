import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private authApi: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    alert('PRE Enviando login...' + this.email.value + this.password.value);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = null;

    alert('Enviando login...' + this.email.value + this.password.value);

    this.authApi.login({
      email: this.email.value,
      password: this.password.value
    }).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        console.log('Token en storage:', this.authApi.getAccessToken());
        console.log('isLoggedIn:', this.authApi.isLoggedIn);
        alert(this.authApi.getAccessToken());
        this.router.navigate(['/']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Authentication failed. Check your credentials.';
      }
    });
  }
}
