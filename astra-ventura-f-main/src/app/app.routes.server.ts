import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Sin necesidad de autenticarse
  { path: 'auth/login', renderMode: RenderMode.Prerender },
  { path: 'auth/register', renderMode: RenderMode.Prerender },

  // Necesitan estar dentro del ecosistema
  { path: 'vehiculos', renderMode: RenderMode.Client },
  { path: 'vehiculos/crear', renderMode: RenderMode.Client },
  { path: 'vehiculos/flota', renderMode: RenderMode.Client },
  { path: 'vehiculos/modelos-externos', renderMode: RenderMode.Client },

  // Como aun no subo Notebook no lo agrego aqui, pero iría en esta parte y en approutes

  // Redirige a login si no se encuentra la ruta
  { path: '**', renderMode: RenderMode.Client }
];