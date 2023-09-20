import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { GroupService } from 'src/group/group.service';
import { SendMessageDto } from 'src/group/dto/sendmessage.dto';
import { OffensiveMessageGuard } from './offensive-message.guard';
import { MessageDto } from 'src/messages/dto/message.dto';
import { PushNotificationService } from 'src/push-notifications/push-notifications.service';
import { PushNotificationDto } from 'src/push-notifications/dto/push-notification.dto';


@WebSocketGateway()
export class CombinedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly groupService: GroupService,
    private readonly pushNotificationService: PushNotificationService
  ) { }

  private logger: Logger = new Logger('CombinedGateway');

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);

    for (const [userId, userSocket] of this.messagesService.getUsers()) {
      if (userSocket === socket) {
        this.messagesService.removeUser(userId);
        this.server.emit('userList', this.messagesService.getUserIds());
        break;
      }
    }
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, data: { userId: string }) {
    const userId = client.id;
    const targetUserId = data.userId;

    const chatRoom = getChatRoomName(userId, targetUserId);
    client.join(chatRoom);

    client.to(chatRoom).emit('userJoined', userId);

    console.log(`User ${userId} joined the 1:1 chat with ${targetUserId}.`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, data: { userId: string }) {
    const userId = client.id;
    const targetUserId = data.userId;

    const chatRoom = getChatRoomName(userId, targetUserId);
    client.leave(chatRoom);

    client.to(chatRoom).emit('userLeft', userId);

    console.log(`User ${userId} left the 1:1 chat with ${targetUserId}.`);
  }
  @SubscribeMessage('sendDirectMessage')
  @UseGuards(OffensiveMessageGuard)
  async handleSendDirectMessage(client: Socket, payload: MessageDto) {
    if (payload.senderId !== undefined && payload.receiverId !== undefined) {

      const userId = payload.senderId;
      const targetUserId = payload.receiverId;


      const message = {
        senderId: userId,
        message: payload.message,
      };
      try {
        const pushNotificationDto: PushNotificationDto = {
          userId: targetUserId,
          message: `You received a new message from ${userId}`,
          senderId: userId,
        };

        await this.pushNotificationService.createPushNotification(pushNotificationDto);

        client.emit('message', message);

        console.log(`User ${userId} sent a message in the 1:1 chat with ${targetUserId}.`);
      } catch (error) {
        console.error('Error sending message and creating push notification:', error.message);
      }

    } else {
      console.error('Invalid senderId or receiverId.');
    }
  }
  @SubscribeMessage('joinGroup')
  async handleJoinGroup(client: Socket, groupId: number) {
    client.join(`group-${groupId}`);
    this.server.to(`group-${groupId}`).emit('message', 'User joined the group.');
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(client: Socket, groupId: number) {
    try {
      client.leave(`group-${groupId}`);
      this.server.to(`group-${groupId}`).emit('message', 'User left the group.');
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('sendGroupMessage')
  @UseGuards(OffensiveMessageGuard)
  async handleSendGroupMessage(client: Socket, payload: SendMessageDto) {
    const messageResponse = await this.groupService.sendMessage(payload);


    await this.pushNotificationService.createGroupPushNotifications(
      payload.groupId,
      messageResponse.content,
      messageResponse.senderId,
    );

    this.server.to(`group-${payload.groupId}`).emit('message', messageResponse);
  }

}


function getChatRoomName(userId: string, targetUserId: string): string {
  const sortedUserIds = [userId, targetUserId].sort();
  return `chat_${sortedUserIds[0]}_${sortedUserIds[1]}`;
}