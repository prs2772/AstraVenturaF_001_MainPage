import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculosApiService } from '../../services/vehiculos-api.service';
import { FleetAllocationResultRes } from '../../models/vehicle-res.model';

type OptimizeMode = 'simple' | 'advanced';

@Component({
  standalone: true,
  selector: 'app-fleet-optimizer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fleet-optimizer.component.html',
  styleUrls: ['./fleet-optimizer.component.scss']
})
export class FleetOptimizerComponent {

  form: FormGroup;
  loading   = false;
  error: string | null = null;
  result: FleetAllocationResultRes | null = null;
  mode: OptimizeMode = 'simple';

  breakdown: { model: string; count: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private vehiculosApi: VehiculosApiService
  ) {
    this.form = this.fb.group({
      totalPassengers: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get passengers() { return this.form.get('totalPassengers')!; }

  setMode(m: OptimizeMode) { this.mode = m; this.result = null; this.error = null; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error   = null;
    this.result  = null;

    const req = { totalPassengers: +this.passengers.value };
    const call$ = this.mode === 'simple'
      ? this.vehiculosApi.optimizeSimple(req)
      : this.vehiculosApi.optimizeAdvanced(req);

    call$.subscribe({
      next: data => {
        this.result = data;
        this.breakdown = Object.entries(data.vehicleBreakdown)
          .map(([model, count]) => ({ model, count }));
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message ?? 'Optimization failed.';
        this.loading = false;
      }
    });
  }
}
