import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy,
  ) {}

  async sendEmailNotification(userId: string, message: string) {
    this.client.emit('email_notification', { userId, message });
  }
}