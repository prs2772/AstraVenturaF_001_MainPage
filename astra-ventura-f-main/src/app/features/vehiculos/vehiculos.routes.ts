import { Routes } from '@angular/router';

export const VEHICULOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/vehiculos-list/vehiculos-list.component')
        .then(m => m.VehiculosListComponent)
  },
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/vehiculo-create/vehiculo-create.component')
        .then(m => m.VehiculoCreateComponent)
  },
  {
    path: 'flota',
    loadComponent: () =>
      import('./pages/fleet-optimizer/fleet-optimizer.component')
        .then(m => m.FleetOptimizerComponent)
  },
  {
    path: 'modelos-externos',
    loadComponent: () =>
      import('./pages/external-models/external-models.component')
        .then(m => m.ExternalModelsComponent)
  }
];
