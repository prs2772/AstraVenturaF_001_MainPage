import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehiculosApiService } from '../../services/vehiculos-api.service';
import { CreateVehicleRes } from '../../models/vehicle-res.model';

@Component({
  standalone: true,
  selector: 'app-vehiculos-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './vehiculos-list.component.html',
  styleUrls: ['./vehiculos-list.component.scss']
})
export class VehiculosListComponent implements OnInit {

  vehicles: CreateVehicleRes[] = [];
  loading = false;
  error: string | null = null;

  constructor(private vehiculosApi: VehiculosApiService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.vehiculosApi.getVehicles().subscribe({
      next: data => { this.vehicles = data; this.loading = false; },
      error: err => { this.error = err?.error?.message ?? 'Failed to load vehicles.'; this.loading = false; }
    });
  }
}
