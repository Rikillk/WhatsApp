import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from './dto/sendmessage.dto';
import { GroupService } from './group.service';

@WebSocketGateway()
export class GroupGateway {
  constructor(private readonly groupService: GroupService) { }

  private logger: Logger = new Logger('GroupGateway');

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
  }
  handleDisconnect(socket: Socket) {
    // this.logger.log(`Client disconnected: ${socket.id}`);
    // const disconnectedUser = this.groupService.getUsers().find(user => user.socket === socket);
    // if (disconnectedUser) {
    //   this.groupService.removeUser(disconnectedUser.id);
    //   this.server.emit('userList', this.groupService.getUserIds());
    // }
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(client: Socket, groupId: number) {
    client.join(`group-${groupId}`);
    this.server.to(`group-${groupId}`).emit('message', 'User joined the group.');
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(client: Socket, groupId: number) {
    client.leave(`group-${groupId}`);
    this.server.to(`group-${groupId}`).emit('message', 'User left the group.');
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: SendMessageDto) {
    const message = await this.groupService.sendMessage(payload);
    this.server.to(`group-${payload.groupId}`).emit('message', message);
  }
}
