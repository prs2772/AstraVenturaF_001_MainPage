import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehiculosApiService } from '../../services/vehiculos-api.service';

export interface NhtsaModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

@Component({
  standalone: true,
  selector: 'app-external-models',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './external-models.component.html',
  styleUrls: ['./external-models.component.scss', '../../vehiculos-shared.scss', '../../vehiculos-extra.scss']
})
export class ExternalModelsComponent {

  form: FormGroup;
  loading = false;
  error: string | null = null;
  models: NhtsaModel[] = [];
  searchedMake = '';

  constructor(
    private fb: FormBuilder,
    private vehiculosApi: VehiculosApiService
  ) {
    this.form = this.fb.group({
      make: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  get make() { return this.form.get('make')!; }

  onSearch() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = null;
    this.models = [];
    this.searchedMake = this.make.value;

    this.vehiculosApi.getExternalModels(this.make.value.toLowerCase()).subscribe({
      next: data => { this.models = data; this.loading = false; },
      error: err => { this.error = err?.error?.message ?? 'Failed to fetch models.'; this.loading = false; }
    });
  }
}
