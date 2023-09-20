import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { Socket } from 'socket.io';
import { Prisma, User } from '@prisma/client'; // Import the Prisma namespace

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const { message, senderId, receiverId, type, messageStatus } = createMessageDto;


    // Create the message using Prisma
    const createdMessage = await this.prisma.messages.create({
      data: {
        message,
        senderId,
        receiverId , 
        type: type || 'text',
        messageStatus: messageStatus || 'sent',
      },
    });

    return this.mapToDto(createdMessage);
  }

  async findMessageById(id: number): Promise<MessageDto> {
    const message = await this.prisma.messages.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.mapToDto(message);
  }

  private mapToDto(message: any): MessageDto {
    return {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      type: message.type,
      message: message.message,
      messageStatus: message.messageStatus,
      createdAt: message.createdAt,
    };
  }

  // WebSocket-related methods
  private users: Map<number, Socket> = new Map<number, Socket>(); // Map userId (number) to socket

  public addUser(userId: number, socket: Socket): void {
    // Add user and socket to the map
    this.users.set(userId, socket);
  }

  public removeUser(userId: number): void {
    // Remove user and socket from the map
    this.users.delete(userId);
  }

  public getUsers(): Map<number, Socket> {
    return this.users;
  }

  public getUser(userId: number): Socket | undefined {
    return this.users.get(userId);
  }

  public getUserIds(): number[] {
    return Array.from(this.users.keys());
  }

  public sendMessage(senderId: number, receiverId: number, message: string): void {
    try {
      const receiverSocket = this.users.get(receiverId);

      if (receiverSocket) {
        if (receiverSocket.connected) {
          receiverSocket.emit('message', { senderId, message });
        } else {
          // Handle the case when the receiver's socket is disconnected
          console.error(`Receiver ${receiverId}'s socket is disconnected.`);
          // Optionally, you can remove the user from the map
          this.removeUser(receiverId);
        }
      } else {
        // Handle the case when the receiver is not found in the map
        console.error(`Receiver ${receiverId} not found.`);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error(`An error occurred while sending a message: ${error.message}`);
    }
  }
  // Assuming you have a message service
async softDeleteMessage(messageId: number) {
  // Find the message by ID
  const message = await this.prisma.messages.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!message) {
    throw new NotFoundException('Message not found');
  }

  // Update the deletedAt field to mark it as soft-deleted
  await this.prisma.messages.update({
    where: {
      id: messageId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

}
