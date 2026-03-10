import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

// Valida exactamente las reglas del backend Password Value Object
function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) return null; // minLength validator cubre el caso vacío

  const errors: string[] = [];

  if (value.length < 8)
    errors.push('Min. 8 caracteres');
  if (!/[A-Z]/.test(value))
    errors.push('Una mayúscula');
  if (!/[a-z]/.test(value))
    errors.push('Una minúscula');
  if (!/[0-9]/.test(value))
    errors.push('Un número');
  if (!/[!#$&/()=.]/.test(value))
    errors.push('Un símbolo: !#$&/()=.');

  return errors.length > 0 ? { strongPassword: errors } : null;
}

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
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  get nombre() { return this.form.get('nombre')!; }
  get apellidoPrincipal() { return this.form.get('apellidoPrincipal')!; }
  get apellidoSecundario() { return this.form.get('apellidoSecundario')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  /** Errores del validador de contraseña fuerte como array de strings */
  get passwordErrors(): string[] {
    return this.password.errors?.['strongPassword'] ?? [];
  }

  private passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  /** Extrae el mensaje legible del error HTTP (PascalCase o camelCase) */
  private extractErrorMessage(err: any): string {
    return (
      err?.error?.Message ||   // ASP.NET Conflict sin camelCase
      err?.error?.message ||   // camelCase (cuando hay JsonNamingPolicy)
      err?.error?.title ||   // ASP.NET ProblemDetails 400/500
      err?.error?.detail ||
      err?.message ||
      'Error al registrar. Intenta de nuevo.'
    );
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
        this.error = this.extractErrorMessage(err);
      }
    });
  }
}
