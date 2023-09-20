import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service'; 

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService) {}


  private logger: Logger = new Logger('MessageGateway');

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
  }
  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
    
   
    for (const [userId, userSocket] of this.messagesService.getUsers()) {
      if (userSocket === socket) {
        this.messagesService.removeUser(userId);
        this.server.emit('userList', this.messagesService.getUserIds());
        break; // Exit the loop once the user is found and removed
      }
    }
  }
  
  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, data: { userId: string }) {
    const userId = client.id;
    const targetUserId = data.userId;

    // Join a unique chat room for the 1:1 chat between userId and targetUserId
    const chatRoom = getChatRoomName(userId, targetUserId);
    client.join(chatRoom);

    // Emit a userJoined event to notify the target user that userId has joined the chat
    client.to(chatRoom).emit('userJoined', userId);

    console.log(`User ${userId} joined the 1:1 chat with ${targetUserId}.`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, data: { userId: string }) {
    const userId = client.id;
    const targetUserId = data.userId;

    // Leave the unique chat room for the 1:1 chat between userId and targetUserId
    const chatRoom = getChatRoomName(userId, targetUserId);
    client.leave(chatRoom);

    // Emit a userLeft event to notify the target user that userId has left the chat
    client.to(chatRoom).emit('userLeft', userId);

    console.log(`User ${userId} left the 1:1 chat with ${targetUserId}.`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, data: { userId: string, text: string }) {
    const userId = client.id;
    const targetUserId = data.userId;

    // Determine the chat room for the 1:1 chat between userId and targetUserId
    const chatRoom = getChatRoomName(userId, targetUserId);

    // Emit the message to the chat room
    client.to(chatRoom).emit('message', {
      senderId: userId,
      text: data.text,
    });

    console.log(`User ${userId} sent a message in the 1:1 chat with ${targetUserId}.`);
  }
}

// Helper function to generate a unique chat room name for 1:1 chats
function getChatRoomName(userId: string, targetUserId: string): string {
  // Sort the user IDs to ensure consistency in chat room names
  const sortedUserIds = [userId, targetUserId].sort();
  return `chat_${sortedUserIds[0]}_${sortedUserIds[1]}`;
}
