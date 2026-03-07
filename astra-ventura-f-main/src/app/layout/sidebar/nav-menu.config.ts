import { NavCategory } from './nav-menu.model';

export const NAV_MENU: NavCategory[] = [
  {
    category: 'Explorar',
    items: [
      {
        label: 'Notebook',
        route: '/notebook',
        icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V4.5A2.5 2.5 0 016.5 2H20v20H6.5'
      },
      {
        label: 'Vehículos',
        route: '/vehiculos',
        icon: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 12h8a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2zm1-8h6m-3-3v3'
      }
    ]
  },
  {
    category: 'Gestión',
    items: [
      { label: 'Gestión app', route: '/admin/usuarios', icon: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 12h8a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2zm1-8h6m-3-3v3' }
    ]
  }
];
