import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { PushNotificationService } from './push-notifications.service';
import { PushNotificationDto } from './dto/push-notification.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('push-notifications')
export class PushNotificationController {
  constructor(private readonly pushNotificationService: PushNotificationService) { }

  @Post()
  async createPushNotification(@Body() pushNotificationDto: PushNotificationDto) {
    try {
      const createdNotification = await this.pushNotificationService.createPushNotification(pushNotificationDto);
      return createdNotification;
    } catch (error) {
      console.error('Error creating push notification:', error.message);
      throw error;
    }
  }
  @Get(':userId')
  async getUnreadNotifications(@Param('userId') userId: number) {
    return this.pushNotificationService.getUnreadNotifications(userId);
  }
}
