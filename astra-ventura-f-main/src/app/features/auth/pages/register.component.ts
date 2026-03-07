import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form: FormGroup;
  loading = false;
  error: string | null = null;
  showPassword = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPrincipal: ['', [Validators.required, Validators.minLength(2)]],
      apellidoSecundario: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  get nombre() { return this.form.get('nombre')!; }
  get apellidoPrincipal() { return this.form.get('apellidoPrincipal')!; }
  get apellidoSecundario() { return this.form.get('apellidoSecundario')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  private passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = null;

    this.auth.register({
      nombre: this.nombre.value,
      apellidoPrincipal: this.apellidoPrincipal.value,
      apellidoSecundario: this.apellidoSecundario.value,
      email: this.email.value,
      password: this.password.value
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Registration failed. Try again.';
      }
    });
  }
}
