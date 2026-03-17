import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { ChangePasswordReq } from '../models/auth-req.model';
import { strongPasswordValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changeForm!: FormGroup;
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authApi: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.changeForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    this.status = 'loading';
    this.errorMsg = '';

    const req: ChangePasswordReq = {
      currentPassword: this.changeForm.value.currentPassword,
      newPassword: this.changeForm.value.newPassword
    };

    this.authApi.changePassword(req).subscribe({
      next: () => {
        this.status = 'success';
      },
      error: (err) => {
        this.status = 'error';
        this.errorMsg = err.error?.message || 'Unauthorized: current cipher is incorrect.';
      }
    });
  }

  onAccept(): void {
    this.router.navigate(['/home']);
  }

  get currentPassword() { return this.changeForm.get('currentPassword'); }
  get newPassword() { return this.changeForm.get('newPassword'); }
  get confirmPassword() { return this.changeForm.get('confirmPassword'); }

  get passwordErrors(): string[] {
    return this.newPassword?.errors?.['strongPassword'] ?? [];
  }
}
