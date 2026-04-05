import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(private auth: AuthService, private router: Router, private sidebarService : SidebarService) {
    this.auth = auth;
    this.router = router;
  }

  toggleSidebar(){
    this.sidebarService.toggle();
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}


