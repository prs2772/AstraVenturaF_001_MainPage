import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Auth pages — client-only (requieren localStorage y HTTP desde el browser)
  { path: 'auth/login', renderMode: RenderMode.Client },
  { path: 'auth/register', renderMode: RenderMode.Client },

  // Necesitan estar dentro del ecosistema
  { path: 'home', renderMode: RenderMode.Client },
  { path: 'notebook', renderMode: RenderMode.Client },
  { path: 'vehiculos', renderMode: RenderMode.Client },
  { path: 'vehiculos/crear', renderMode: RenderMode.Client },
  { path: 'vehiculos/flota', renderMode: RenderMode.Client },
  { path: 'vehiculos/modelos-externos', renderMode: RenderMode.Client },

  // Redirige a login si no se encuentra la ruta
  { path: '**', renderMode: RenderMode.Client }
];