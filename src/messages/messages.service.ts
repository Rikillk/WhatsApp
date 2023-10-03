import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { Socket } from 'socket.io';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private prisma: PrismaService) { }

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const { message, senderId, receiverId, type, messageStatus } = createMessageDto;

    try {
      const createdMessage = await this.prisma.messages.create({
        data: {
          message,
          senderId,
          receiverId,
          type: type || 'text',
          messageStatus: messageStatus || 'sent',
        },
      });

      this.logger.log(`Message created successfully: ID ${createdMessage.id}`);

      return this.mapToDto(createdMessage);
    } catch (error) {
      this.logger.error(error, 'MessagesService.createMessage');
      throw error;
    }
  }

  async findMessageById(id: number): Promise<MessageDto> {
    try {
      const message = await this.prisma.messages.findUnique({
        where: { id },
      });

      if (!message) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }

      this.logger.log(`Message found: ID ${message.id}`);

      return this.mapToDto(message);
    } catch (error) {
      this.logger.error(error, 'MessagesService.findMessageById');
      throw error;
    }
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
  private users: Map<number, Socket> = new Map<number, Socket>();

  public addUser(userId: number, socket: Socket): void {
    this.users.set(userId, socket);
  }

  public removeUser(userId: number): void {
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
          const errorMessage = `Receiver ${receiverId}'s socket is disconnected.`;
          console.error(errorMessage);
          this.logger.warn(errorMessage);
          this.removeUser(receiverId);
        }
      } else {
        const errorMessage = `Receiver ${receiverId} not found.`;
        console.error(errorMessage);
        this.logger.warn(errorMessage);
      }
    } catch (error) {
      const errorMessage = `An error occurred while sending a message: ${error.message}`;
      console.error(errorMessage);
      this.logger.error(errorMessage);
    }
  }

  async softDeleteMessage(messageId: number) {
    try {
      const message = await this.prisma.messages.findUnique({
        where: {
          id: messageId,
        },
      });

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      await this.prisma.messages.update({
        where: {
          id: messageId,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      this.logger.log(`Message with ID ${messageId} soft-deleted successfully`);
    } catch (error) {
      const errorMessage = `An error occurred while soft-deleting a message: ${error.message}`;
      console.error(errorMessage);
      this.logger.error(errorMessage);
      throw error;
    }
  }

}
