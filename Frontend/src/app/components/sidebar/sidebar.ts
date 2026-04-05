import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {

  isOpen = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.sidebarState$.subscribe(state => {
      this.isOpen = state;
    });
  }
  closeSidebar() {
  this.sidebarService.toggle();
}

}
