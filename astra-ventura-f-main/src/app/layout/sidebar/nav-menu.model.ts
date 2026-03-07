export interface NavItem {
  label: string;
  route: string;
  icon: string;// Ruta
}

export interface NavCategory {
  category: string;
  items: NavItem[];
}
