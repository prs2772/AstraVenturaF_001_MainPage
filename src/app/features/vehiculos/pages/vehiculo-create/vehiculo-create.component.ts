import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehiculosApiService } from '../../services/vehiculos-api.service';

@Component({
  standalone: true,
  selector: 'app-vehiculo-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehiculo-create.component.html',
  styleUrls: ['./vehiculo-create.component.scss', '../../vehiculos-shared.scss', '../../vehiculos-extra.scss']
})
export class VehiculoCreateComponent {

  form: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vehiculosApi: VehiculosApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      passengerCapacity: ['', [Validators.required, Validators.min(1)]],
      kmPerLiter: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = null;
    this.success = false;

    this.vehiculosApi.createVehicle({
      vin: this.f['vin'].value,
      brand: this.f['brand'].value,
      model: this.f['model'].value,
      year: +this.f['year'].value,
      price: +this.f['price'].value,
      passengerCapacity: +this.f['passengerCapacity'].value,
      kmPerLiter: +this.f['kmPerLiter'].value
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/vehiculos']), 1500);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Failed to register vehicle.';
      }
    });
  }
}
