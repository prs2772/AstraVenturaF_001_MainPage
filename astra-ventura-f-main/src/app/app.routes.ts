import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    // Sin necesidad de autenticarse
    {
        path: 'auth/login',
        loadComponent: () =>
            import('./features/auth/pages/login.component')
                .then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () =>
            import('./features/auth/pages/register.component')
                .then(m => m.RegisterComponent)
    },

    // Necesitan estar dentro del ecosistema
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/layout.component')
                .then(m => m.LayoutComponent),
        children: [

            {
                path: 'vehiculos',
                loadComponent: () =>
                    import('./features/vehiculos/pages/vehiculos-list/vehiculos-list.component')
                        .then(m => m.VehiculosListComponent)
            },
            {
                path: 'vehiculos/crear',
                loadComponent: () =>
                    import('./features/vehiculos/pages/vehiculo-create/vehiculo-create.component')
                        .then(m => m.VehiculoCreateComponent)
            },
            {
                path: 'vehiculos/flota',
                loadComponent: () =>
                    import('./features/vehiculos/pages/fleet-optimizer/fleet-optimizer.component')
                        .then(m => m.FleetOptimizerComponent)
            },
            {
                path: 'vehiculos/modelos-externos',
                loadComponent: () =>
                    import('./features/vehiculos/pages/external-models/external-models.component')
                        .then(m => m.ExternalModelsComponent)
            },

            { path: '', redirectTo: 'vehiculos', pathMatch: 'full' }
        ]
    },

    // Redirige a login si no se encuentra la ruta
    { path: '**', redirectTo: 'auth/login' }

];
