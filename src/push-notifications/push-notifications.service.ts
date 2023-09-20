import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PushNotificationDto } from './dto/push-notification.dto';
@Injectable()
export class PushNotificationService {
  constructor(private readonly prisma: PrismaService) { }

  async createPushNotification(pushNotificationDto: PushNotificationDto) {
    try {
      const createdNotification = await this.prisma.pushNotification.create({
        data: {
          userId: pushNotificationDto.userId,
          message: pushNotificationDto.message,
          senderId: pushNotificationDto.senderId,
          groupId: pushNotificationDto.groupId || null,
          isRead: false,
        },
      });

      return createdNotification;
    } catch (error) {
      console.error('Error creating push notification:', error.message);
      throw error;
    }
  }

  async getUnreadNotifications(userId: number) {
    return this.prisma.pushNotification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async createGroupPushNotifications(groupId: number, message: string, senderId: number) {
    const groupMembers = await this.prisma.groupMember.findMany({
      where: {
        groupId,
        NOT: {
          userId: senderId,
        },
      },
    });

    const notifications = groupMembers.map((member) => ({
      userId: member.userId.toString(),
      message: message.toString(),
      senderId: senderId.toString(),
      groupId: groupId.toString(),
      isRead: false,
    }));

    await this.prisma.pushNotification.createMany({
      data: notifications as any[],
    });
  }

}
