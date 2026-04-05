import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../../services/apprenant';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  notifications: any[] = [];
  unreadCount = 0;

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
      this.loadNotifications();
      this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.apprenantService.getNotifications().subscribe({
      next: data => this.notifications = data

    });
  }

  loadUnreadCount(): void {
    this.apprenantService.getNotificationsNonLuesCount().subscribe({
      next: (count) => this.unreadCount = count
    });
  }

  markAsRead(notificationId: number): void {
    this.apprenantService.marquerNotificationLue(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
        this.loadUnreadCount();
      }

    });
  }

   markAllAsRead(): void {
    this.apprenantService.marquerToutesNotificationsLues().subscribe({
      next: () => {
        this.loadNotifications();
        this.loadUnreadCount();
      }
    });
  }



}
