import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_MENU } from './nav-menu.config';
import { NavCategory } from './nav-menu.model';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input()  collapsed = false;
  @Output() toggleEvent = new EventEmitter<boolean>();

  menu: NavCategory[] = NAV_MENU;

  toggle() {
    this.collapsed = !this.collapsed;
    this.toggleEvent.emit(this.collapsed);
  }
}
